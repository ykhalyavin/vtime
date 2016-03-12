(function() {
    'use strict';

    var app = angular.module('timesheet');

    app.service('Settings', ['$location', Settings]);
    app.factory('GetFactory', ['$http', GetFactory]);
    app.factory('SearchFactory', ['$http', SearchFactory]);
    app.factory('BuildPlotConf', BuildPlotConf);
    app.factory('TeamViewData', TeamViewData);

    function TeamViewData() {
        return function (view) {
            var x = {
                'users': {
                    url: '/api/team/users',
                    tableColumns: [
                        {
                            name: 'username',
                            desc: 'User',
                            template: 'users_table_user_column',
                        },
                        {
                            name: 'spent_hours',
                            desc: 'Time Spent hour(s)'},
                        {
                            name: 'tickets',
                            desc: 'Tickets',
                            template: 'users_table_tickets_column',
                        }
                    ]
                },
                'tickets': {
                    url: '/api/team/tickets',
                    tableColumns: [
                        {
                            name: 'ticket',
                            desc: 'Ticket',
                            template: 'tickets_table_ticket_column',
                        },
                        {
                            name: 'spent_hours',
                            desc: 'Time Spent hour(s)'
                        },
                        {
                            name: 'users',
                            desc: 'Users',
                            template: 'tickets_table_users_column',
                        },
                    ]
                }
            };

            return x[view];
        };
    }


    function Settings($location) {
        var dates = {
            startDate: moment().weekday(-7).format("YYYY-MM-DD"),
            endDate: window.MAXDATE
        };
        var urlParams = $location.search();

        if (urlParams.startDate) {
            dates.startDate = urlParams.startDate;
        }
        if (urlParams.endDate) {
            dates.endDate = urlParams.endDate;
        }

        this.dates = dates;
    }

    function GetFactory($http) {
        return function (params, url, callback) {
            return function get(startDate, endDate) {
                var p = {
                    start_date: startDate,
                    end_date: endDate,
                };
                _.extend(p, params);

                $http({
                    method: 'GET',
                    url: url,
                    params: p
                }).then(function(response) {
                    callback(response.data);
                });
            };
        };
    }

    function SearchFactory($http) {
        return function(callback) {
            return function (query) {
                var url = '/api/user_search/';

                if (query.match(/^\d+$/)) { // ticket, no search
                    url = '/api/ticket_search/';
                }

                return $http.get(url + query + '/').then(function (response) {
                    callback(response.data);
                });
            };
        };
    }

    function BuildPlotConf() {
        return function (seriesData, plotHeader) {
            return {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: plotHeader
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' +
                                '<br />{point.y} hour(s)',
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %' +
                                    '<br />{point.y} hour(s)',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Time spent',
                    colorByPoint: true,
                    data: seriesData
                }]
            };
        };
    }

})();
