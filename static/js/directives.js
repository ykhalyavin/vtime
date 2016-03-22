(function() {
    'use strict';

    var path = 'mocks/';

    angular.module('timesheet')
        .directive('calendar', ['Settings', '$location', Calendar])
        .directive('sortableTable', SortableTable)
        .directive('highchartsPlot', HighchartsPlot);

    function SortableTable() {
        return {
            restrict: 'E',
            scope: {
                columns: '=',
                tableData: '=',
                sortColumn: '@',
                sortDesc: '='
            },
            templateUrl: 'static/templates/snippets/sortable-table.html',
            link: function(scope, element, attrs) {
                scope.sort = function (columnName) {
                    if (columnName == scope.sortColumn) {
                        scope.sortDesc = !scope.sortDesc;
                    } else {
                        scope.sortColumn = columnName;
                        scope.sortDesc = false;
                    }
                };

                scope.toggleExpand = function(direction, e) {
                    var $e = $(e.target).closest('.expandable-target');
                    $e.hide().siblings().show();
                };
            }
        };
    }

    function Calendar(Settings, $location) {
        return {
            restrict: 'A',
            templateUrl: 'static/templates/snippets/calendar.html',
            link: function(scope, element, attrs) {
                var dates = Settings.dates,
                    format = 'YYYY-MM-DD';

                function setDateRange(startDate, endDate) {
                    scope.dateRange = startDate + ' — ' + endDate;
                }

                function cb(start, end) {
                    setDateRange(start.format(format), end.format(format));

                    dates.startDate = start.format(format);
                    dates.endDate = end.format(format);

                    scope.$broadcast('calendarChanged', {
                        startDate: dates.startDate,
                        endDate: dates.endDate
                    });
                    scope.$apply();
                }

                setDateRange(dates.startDate, dates.endDate);

                element.daterangepicker({
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                    minDate: window.MINDATE,
                    maxDate: window.MAXDATE,
                    alwaysShowCalendars: true,
                    autoApply: true,
                    locale: {
                        format: format,
                        firstDay: 1
                    },
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    }

                }, cb);

                scope.$on('datesChanged', function () {
                    element.data('daterangepicker').setDateRange(
                        dates.startDate, dates.endDate);
                });
            }
        };
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
