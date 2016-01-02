(function() {
    'use strict';

    var app = angular.module('timesheet');

    app.factory('Data', function($http) {
        return {
            get: function(from, to) {
                return $http({
                    method: 'POST',
                    url: '/',
                    data: {
                        start_date: from, end_date: to
                    }
                });
            }
        };
    });
})();
