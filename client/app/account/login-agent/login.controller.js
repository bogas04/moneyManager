'use strict';

angular.module('moneyManagerApp')
  .controller('LoginAgentCtrl', function ($scope, AuthAgent, $location, $window) {
    $scope.agent = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        AuthAgent.login({
          username: $scope.agent.username,
          email: $scope.agent.email,
          password: $scope.agent.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/agent');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth-agent/' + provider;
    };
  });
