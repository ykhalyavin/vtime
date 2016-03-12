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
            require : 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                var dates = Settings.dates;

                element.dateRangePicker(
                {
                    format: 'YYYY-MM-DD',
                    startOfWeek: 'monday',
                    autoClose: true,
                    showShortcuts: true,
                    separator: ' — ',
                    shortcuts:
                    {
                        'prev': ['week', 'month'],
                        'next-days': null,
                        'next': null
                    },
                    getValue: function() {
                        return this.innerHTML;
                    },
                    setValue: function(s) {
                        this.innerHTML = s;
                    },
                    beforeShowDay: function(t) {
                        var valid = (moment(t) >= moment(window.MINDATE) &&
                                     moment(t) <= moment(window.MAXDATE));
                        var _class = '';
                        var _tooltip = valid ? '' : 'No records for this date';
                        return [valid, _class, _tooltip];
                    }
                }).bind('datepicker-change', function(e, obj) {
                    dates.startDate = moment(obj.date1).format('YYYY-MM-DD');
                    dates.endDate = moment(obj.date2).format('YYYY-MM-DD');

                    scope.$broadcast('calendarChanged', {
                        startDate: dates.startDate,
                        endDate: dates.endDate
                    });

                }).data().dateRangePicker.setDateRange(
                    dates.startDate, dates.endDate
                );

                scope.$on('datesChanged', function () {
                    element.data('dateRangePicker').setDateRange(
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
