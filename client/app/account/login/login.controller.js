'use strict';

angular.module('moneyManagerApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    $scope.admin = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.admin.email,
          password: $scope.admin.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/admin');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
