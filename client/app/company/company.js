'use strict';

angular.module('moneyManagerApp')
  .config(function ($routeProvider) {
    $routeProvider
    .when('/company', {
      templateUrl: 'app/company/company.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/profile', {
      templateUrl: 'app/company/profile.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/list/agent', {
      templateUrl: 'app/company/list-agents.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/list/customer', {
      templateUrl: 'app/company/list-customers.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/create/agent', {
      templateUrl: 'app/company/create-agent.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/create/customer', {
      templateUrl: 'app/company/create-customer.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/update/customer/:id', {
      templateUrl: 'app/company/update-customer.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/update/agent/:id', {
      templateUrl: 'app/company/update-agent.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/profile/customer/:id', {
      templateUrl: 'app/company/profile-customer.html',
      controller: 'CompanyCtrl'
    })
    .when('/company/profile/agent/:id', {
      templateUrl: 'app/company/profile-agent.html',
      controller: 'CompanyCtrl'
    });
  });
