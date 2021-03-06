'use strict';

angular.module('moneyManagerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/login-agent', {
        templateUrl: 'app/account/login-agent/login.html',
        controller: 'LoginAgentCtrl'
      })
      .when('/login-company', {
        templateUrl: 'app/account/login-company/login.html',
        controller: 'LoginCompanyCtrl'
      });
  });
