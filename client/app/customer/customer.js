'use strict';

angular.module('moneyManagerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/customer', {
        templateUrl: 'customer/customer.html',
        controller: 'CustomerCtrl'
      });
  });
