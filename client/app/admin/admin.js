'use strict';

angular.module('moneyManagerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
    .when('/admin/profile', {
      templateUrl: 'app/admin/profile.html',
      controller: 'AdminCtrl'
    })
    .when('/admin/list/company', {
      templateUrl: 'app/admin/company/list.html',
      controller: 'AdminCtrl'
    })
    .when('/admin/profile/company/:companyId', {
      templateUrl: 'app/admin/company/profile.html',
      controller: 'AdminCtrl'
    })
    .when('/admin/list/admin', {
      templateUrl: 'app/admin/list.html',
      controller: 'AdminCtrl'
    })
    .when('/admin/create/company', {
      templateUrl: 'app/admin/company/create.html',
      controller: 'AdminCtrl'
    });
  });
