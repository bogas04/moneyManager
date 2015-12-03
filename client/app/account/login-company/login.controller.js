'use strict';

angular.module('moneyManagerApp')
  .controller('LoginCompanyCtrl', function ($scope, AuthCompany, $location, $window) {
    $scope.company = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        AuthCompany.login({
          username: $scope.company.username,
          password: $scope.company.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/company');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth-company/' + provider;
    };
  });
