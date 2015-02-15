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
      templateUrl: 'app/admin/list-companies.html',
      controller: 'AdminCtrl'
    })
    .when('/admin/list/admin', {
      templateUrl: 'app/admin/list-admins.html',
      controller: 'AdminCtrl'
    })
    .when('/admin/create/company', {
      templateUrl: 'app/admin/create-company.html',
      controller: 'AdminCtrl'
    });
  });
