(function() {
    'use strict';

    var path = 'mocks/';
    
    angular.module('timesheet')
        .directive('usersList', UsersList)
        .directive('ticketsList', TicketsList)
        .directive('highchartsPlot', HighchartsPlot);

    function UsersList(Data) {
        return {
            templateUrl: 'static/templates/snippets/users.html',
            link: function(scope, element) {
                Data.get('2015-11-01', '2015-11-10').then(function(response) {
                    scope.users = _.reduce(response.data.data_by_user, function(memo, item, key) {
                        memo.push({
                            username: key,
                            tickets: item.tickets
                        });
                        return memo;
                    }, []);
                });

                scope.toggleExpand = function(direction, e) {
                    var $e = $(e.target).closest('.expandable-target');
                    $e.hide().siblings().show();
                };
            }
        };
    }

    function TicketsList($http) {
        return {
            templateUrl: 'static/templates/snippets/tickets.html',
            link: function(scope, element) {
                $http.get(path + 'data_by_ticket.json?' + new Date()).then(function(response) {
                    var users = _.reduce(response.data, function(memo, item, key) {
                        memo.push({
                            id: key,
                            users: item.users
                        });
                        return memo;
                    }, []);
                    scope.tickets = users;
                });

                scope.toggleExpand = function(direction, e) {
                    var $e = $(e.target).closest('.expandable-target');
                    $e.hide().siblings().show();
                };
            }
        }
    }

    function HighchartsPlot() {
        return {
            scope: {
                params: '='
            },
            link: function(scope, element) {
                scope.$watch('params', function(value) {
                    if (value) {
                        element.highcharts(scope.params);
                    }
                });
            }
        };
    }
})();
