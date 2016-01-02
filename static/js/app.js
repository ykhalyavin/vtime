(function() {
    'use strict';

    var app = angular.module('timesheet', ['ngRoute']);
    
    app.controller('BaseCtrl', function($scope) {
        //
    });
    
    app.config(function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: 'static/templates/views/user_list.html',
            controller: 'UsersCtrl',
            controllerAs: 'ctrl'
        }).when('/users', {
            templateUrl: 'static/templates/views/user_list.html',
            controller: 'UsersCtrl',
            controllerAs: 'ctrl'
        }).when('/tickets', {
            templateUrl: 'static/templates/views/ticket_list.html',
            controller: 'TicketsCtrl',
            controllerAs: 'ctrl'
        }).when('/user/:username', {
            templateUrl: 'static/templates/views/user.html',
            controller: 'UserCtrl',
            controllerAs: 'ctrl'
        }).when('/ticket/:ticketId', {
            templateUrl: 'static/templates/views/ticket.html',
            controller: 'TicketCtrl',
            controllerAs: 'ctrl'
        });
        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function() {
            return {
                'request': function(config) {
                    config.headers['X-Requested-With'] = 'XMLHttpRequest';
                    if (config.data) {
                        config.data.csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]').val();
                        config.data = $.param(config.data);
                        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    }
                    return config;
                },
                'response': function(response) {
                    return response;
                }
            };
        });
    });
})();
