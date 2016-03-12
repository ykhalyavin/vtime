(function() {
    'use strict';

    var app = angular.module('timesheet',
                             ['ngRoute', 'ngSanitize', 'ui.select']);

    app.config(['$routeProvider', '$locationProvider', '$httpProvider',
                configProvider]);


    function configProvider($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.when('/', {
            controller: 'BaseCtrl',
            controllerAs: 'ctrl'
        }).when('/search/:query/?', {
            controller: 'BaseCtrl',
            controllerAs: 'ctrl'
        }).when('/team/:teamSlug/users/?', {
            templateUrl: 'static/templates/views/user_list.html',
            controller: 'TeamCtrl',
            controllerAs: 'ctrl',
            resolve: {viewSlug: function () {return 'users';}}
        }).when('/team/:teamSlug/tickets/?', {
            templateUrl: 'static/templates/views/ticket_list.html',
            controller: 'TeamCtrl',
            controllerAs: 'ctrl',
            resolve: {viewSlug: function () {return 'tickets';}}
        }).when('/user/:username/?', {
            templateUrl: 'static/templates/views/user.html',
            controller: 'UserCtrl',
            controllerAs: 'ctrl'
        }).when('/ticket/:ticketId/?', {
            templateUrl: 'static/templates/views/ticket.html',
            controller: 'TicketCtrl',
            controllerAs: 'ctrl'
        }).otherwise({
            controller: 'BaseCtrl',
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
    }
})();
