(function() {
    'use strict';

    var path = 'mocks/';
    var app = angular.module('timesheet');

    app.controller('UsersCtrl', function() {
    });

    app.controller('TicketsCtrl', TicketsCtrl);

    app.controller('UserCtrl', UserCtrl);
    app.controller('TicketCtrl', TicketCtrl);

    function UserCtrl($http, $routeParams) {
        var ctrl = this;
        ctrl.username = $routeParams.username;

        $http.get(path + 'data_by_ticket.json?' + new Date()).then(function(response) {
            ctrl.data = response.data;
            //var seriesData = _.reduce(ticketData.users, function(memo, item, key) {
            //    var t = {
            //        name: item.name,
            //        y: item.time_spent_sec,
            //        time_spent: item.time_spent
            //    };
            //    memo.push(t);
            //    return memo;
            //}, []);
            //ctrl.plotParams = {
            //    chart: {
            //        plotBackgroundColor: null,
            //        plotBorderWidth: null,
            //        plotShadow: false,
            //        type: 'pie'
            //    },
            //    title: {
            //        text: 'Time spendings on #' + ctrl.ticketId
            //    },
            //    tooltip: {
            //        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' +
            //        '<br />{point.time_spent}',
            //    },
            //    plotOptions: {
            //        pie: {
            //            allowPointSelect: true,
            //            cursor: 'pointer',
            //            dataLabels: {
            //                enabled: false
            //            },
            //            showInLegend: true
            //        }
            //    },
            //    series: [{
            //        name: 'Time spent',
            //        colorByPoint: true,
            //        data: seriesData
            //    }]
            //};
        });
    }

    function TicketsCtrl() {

    }

    function TicketCtrl($routeParams, $http) {
        var ctrl = this;
        ctrl.ticketId = $routeParams.ticketId;

        $http.get(path + 'data_by_ticket.json?' + new Date()).then(function(response) {
            var ticketData = response.data[ctrl.ticketId];
            ctrl.totalSpent = ticketData.time_spent;
            ctrl.ticketData = ticketData;
            var seriesData = _.reduce(ticketData.users, function(memo, item, key) {
                var t = {
                    name: item.name,
                    y: item.time_spent_sec,
                    time_spent: item.time_spent
                };
                memo.push(t);
                return memo;
            }, []);
            ctrl.plotParams = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Time spendings on #' + ctrl.ticketId
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' +
                                 '<br />{point.time_spent}',
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
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
        });
    }
})();
