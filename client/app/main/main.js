'use strict';

angular.module('moneyManagerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
    .when('/admin', {
      templateUrl: 'app/admin/admin.html',
      controller: 'AdminCtrl'
    })
    .when('/company', {
      templateUrl : 'app/company/company.html',
      controller : 'CompanyCtrl'
    })
    .when('/agent', {
      templateUrl : 'app/agent/agent.html',
      controller : 'AgentCtrl'
    });
  });
