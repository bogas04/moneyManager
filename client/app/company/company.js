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
    templateUrl: 'app/company/agent/list.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/list/customer', {
    templateUrl: 'app/company/customer/list.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/create/agent', {
    templateUrl: 'app/company/agent/create.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/create/customer', {
    templateUrl: 'app/company/customer/create.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/update/customer/:id', {
    templateUrl: 'app/company/customer/update.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/update/agent/:id', {
    templateUrl: 'app/company/agent/update.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/profile/customer/:id', {
    templateUrl: 'app/company/customer/profile.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/profile/agent/:id', {
    templateUrl: 'app/company/agent/profile.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/profile/customer/:id/terms', {
    templateUrl: 'app/company/customer/terms.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/profile/customer/:id/logs', {
    templateUrl: 'app/company/customer/all-logs.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/profile/customer/:id/terms/add', {
    templateUrl: 'app/company/customer/add-terms.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/profile/customer/:id/terms/:termname', {
    templateUrl: 'app/company/customer/view-term.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/profile/customer/:id/terms/:termname/logs', {
    templateUrl: 'app/company/customer/logs.html',
    controller: 'CompanyCtrl'
  })
  .when('/company/profile/customer/:id/terms/:termname/logs/add', {
    templateUrl: 'app/company/customer/add-logs.html',
    controller: 'CompanyCtrl'
  });
});
