(function() {
    'use strict';

    angular.module('timesheet')
        .directive('calendar', ['Settings', '$location', Calendar])
        .directive('highchartsPlot', HighchartsPlot)
        .component('sortableTable', SortableTable());


    function SortableTable() {
        return {
            bindings: {
                columns: '<',
                tableData: '<',
                sortColumn: '@',
                sortDesc: '<'
            },
            templateUrl: 'static/templates/snippets/sortable-table.html',
            controller: function () {
                var ctrl = this;

                ctrl.isExpanded = {};

                ctrl.sort = function (columnName) {
                    if (columnName === ctrl.sortColumn) {
                        ctrl.sortDesc = !ctrl.sortDesc;
                    } else {
                        ctrl.sortColumn = columnName;
                        ctrl.sortDesc = false;
                    }
                };

                ctrl.toggleExpand = function (rowIndex) {
                    ctrl.isExpanded[rowIndex] = !ctrl.isExpanded[rowIndex];
                };
            }
        }
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
                        'Yesterday': [moment().subtract(1, 'days'),
                                      moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'),
                                       moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'),
                                       moment().subtract(1, 'month').endOf('month')]
                    }

                }, cb);

                scope.$on('datesChanged', function () {
                    var drp = element.data('daterangepicker');
                    drp.setStartDate(dates.startDate);
                    drp.setEndDate(dates.endDate);
                    setDateRange(dates.startDate, dates.endDate);
                });
            }
        };
    }

    function HighchartsPlot() {
        return {
            scope: {
                params: '<'
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
