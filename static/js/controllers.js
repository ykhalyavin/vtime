(function() {
    'use strict';

    var app = angular.module('timesheet');

    app.controller('BaseCtrl', ['Settings', 'SearchFactory', '$scope',
                                '$location', '$timeout', '$window', BaseCtrl]);
    app.controller('TeamCtrl', ['Settings', 'GetFactory', 'TeamViewData',
                                'viewSlug', '$scope', '$routeParams',
                                '$window', TeamCtrl]);
    app.controller('UserCtrl', ['Settings', 'GetFactory', 'BuildPlotConf',
                                '$scope', '$routeParams', UserCtrl]);
    app.controller('TicketCtrl', ['Settings', 'GetFactory', 'BuildPlotConf',
                                  '$scope', '$routeParams', TicketCtrl]);

    function BaseCtrl(Settings, SearchFactory, $scope, $location, $timeout,
                      $window) {
        $scope.viewData = [{slug: 'users', name: 'Users'},
                           {slug: 'tickets', name: 'Tickets'}];
        $scope.teamData = window.TEAMS;

        $scope.searchResults = [];
        $scope.search = SearchFactory(function (data) {
            $scope.searchResults = data;
        });

        $scope.searchItemSelected = function (item, model) {
            var path = (typeof item.name === 'number' ?
                        '/ticket/' : '/user/') + item.name + '/';

            $location.path(
                path
            ).search({
                'startDate': Settings.dates.startDate,
                'endDate': Settings.dates.endDate
            });
        };

        $scope.setDatesUrl = function () {
            $location.search({
                'startDate': Settings.dates.startDate,
                'endDate': Settings.dates.endDate
            });
        };

        $scope.$on('calendarChanged', function (e, data) {
            Settings.dates.startDate = data.startDate;
            Settings.dates.endDate = data.endDate;
            $scope.setDatesUrl();
        });

        $scope.$on('$locationChangeStart', function (e, nextUrl, currentUrl) {
            $scope.startDateStr = moment(
                Settings.dates.startDate).format('MMMM YYYY');

            // Here we ensure, startDate and endDate are always in URL.
            // We cannot just add them as an additional call
            // $location.search({...}), because it would cause an additional
            // history record in a browser.
            if (nextUrl.indexOf('startDate') == -1 ||
                    nextUrl.indexOf('endDate') == -1) {

                var el = document.createElement('a');
                el.href = nextUrl;

                $location.path(
                    el.pathname
                ).search({
                    'startDate': Settings.dates.startDate,
                    'endDate': Settings.dates.endDate
                });
            }
        });
        $scope.$on('$routeChangeSuccess', function (e, next, current) {
            // For history back/forward purposes, when a user clicks "Back"
            // button dates may changed and we need to update everything.
            var p = $location.search();
            if (p.startDate !== Settings.dates.startDate ||
                    p.endDate !== Settings.dates.endDate) {
                Settings.dates.startDate = p.startDate;
                Settings.dates.endDate = p.endDate;

                $scope.$emit('datesChanged');
            }

            // Here we detect that we are in BaseCtrl, no other controllers
            // initialized yet, so we need to display something by default.
            $timeout(function () {
                var l = $window.localStorage,
                    t = l.teamSlug || _.first($scope.teamData).slug;

                if (next.scope === undefined && t) {
                    $location.path(
                        '/team/' + t + '/users/'
                    ).search({
                        'startDate': Settings.dates.startDate,
                        'endDate': Settings.dates.endDate
                    });
                }
            }, 0);
        });
    }

    function TeamCtrl(Settings, GetFactory, TeamViewData, viewSlug, $scope,
                      $routeParams, $window) {
        var ctrl = this,
            viewData = TeamViewData(viewSlug);

        ctrl.tableColumns = viewData.tableColumns;

        $scope.viewSlug = viewSlug;
        $scope.teamSlug = $routeParams.teamSlug;
        $scope.teamName = _.find($scope.teamData,
                                 {slug: $scope.teamSlug}).name;
        $scope.viewName = _.find($scope.viewData,
                                 {slug: viewSlug}).name;

        $window.localStorage.teamSlug = $scope.teamSlug;

        var get = GetFactory({team_slug: $scope.teamSlug}, viewData.url,
            function (data) {
                ctrl.tableData = data.data;
                ctrl.workhours = data.workhours;
            }
        );
        $scope.$on('calendarChanged', function (e, data) {
            get(data.startDate, data.endDate);
        });

        get(Settings.dates.startDate, Settings.dates.endDate);
    }

    function TicketUserBase(Settings, GetFactory, BuildPlotConf, $scope) {
        var ctrl = this;
        var callback = function (data) {
            _.extend(ctrl, data);

            var seriesData = _.reduce(ctrl.data, function(memo, item, key) {
                memo.push({name: item.id, y: item.spent_hours});
                return memo;
            }, []);

            ctrl.plotConf = BuildPlotConf(seriesData, ctrl.plotHeader);
        };
        var get = GetFactory({obj_id: ctrl.objId}, ctrl.url, callback);

        $scope.$on('calendarChanged', function (e, data) {
            get(data.startDate, data.endDate);
        });
        get(Settings.dates.startDate, Settings.dates.endDate);
    }

    function TicketCtrl(Settings, GetFactory, BuildPlotConf, $scope,
                        $routeParams) {
        var ctrl = this;

        ctrl.url = '/api/by_ticket';
        ctrl.objId = $routeParams.ticketId;
        ctrl.plotHeader = 'Time spendings on #' + ctrl.objId;
        ctrl.tableColumns = [
            {
                name: 'id',
                desc: 'User',
                template: 'ticket_table_user_column',
            },
            {name: 'spent_hours', desc: 'Time Spent hour(s)'}
        ];

        TicketUserBase.call(ctrl, Settings, GetFactory, BuildPlotConf, $scope);
    }

    function UserCtrl(Settings, GetFactory, BuildPlotConf, $scope,
                      $routeParams) {
        var ctrl = this;

        ctrl.url = '/api/by_user';
        ctrl.objId = $routeParams.username;
        ctrl.tableColumns = [
            {
                name: 'id',
                desc: 'Ticket',
                template: 'user_table_ticket_column',
            },
            {name: 'spent_hours', desc: 'Time Spent hour(s)'}
        ];

        TicketUserBase.call(ctrl, Settings, GetFactory, BuildPlotConf, $scope);
    }
})();
