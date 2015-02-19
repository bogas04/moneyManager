'use strict';

angular.module('moneyManagerApp')
  .controller('CompanyCtrl', function ($routeParams, $scope, $location, $http, AuthCompany, Company) {
    $scope.message = '';
    $scope.company = Company.get();
    $scope.customers = [];
    $scope.agents = []; 

    $http.get('/api/company/customers/')
      .success( function (data, status, headers, config) {
        $scope.customers = data;
        angular.forEach(data, function(item) {
          if(item._id == $routeParams.id) {
            $scope.currentCustomer = item;
          }
        });
      })
      .error( function (data, status, headers, config) {
        console.log(data, status, headers, config);
      });

    $http.get('/api/company/agents/')
      .success( function (data, status, headers, config) {
        $scope.agents = data;
        angular.forEach(data, function(item) {
          if(item._id == $routeParams.id) {
            $scope.currentAgent = item;
          }
        });
      })
      .error( function (data, status, headers, config) {
        console.log(data, status, headers, config);
      });


    $scope.createAgent = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.post('/api/company/agents', $scope.createThisAgent)
        .success( function (data, status, headers, config){
          console.log(data, status, headers, config);
        })
        .error( function (data, status, headers, config){
          console.log(data, status, headers, config);
        });
      }
    };
    $scope.createCustomer = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.post('/api/company/customers', $scope.createThisCustomer)
        .success( function (data, status, headers, config){
          console.log(data, status, headers, config);
        })
        .error( function (data, status, headers, config){
          console.log(data, status, headers, config);
        });
      }
    };
    $scope.updateCustomer = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.put('/api/company/customers/'+$routeParams.id, $scope.updateThisCustomer)
        .success( function (data, status, headers, config){
          console.log(data, status, headers, config);
        })
        .error( function (data, status, headers, config){
          console.log(data, status, headers, config);
        });
      }
    };
    
    $scope.update = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        AuthCompany.update($scope.company.updated)
        .then( function() {
          $scope.message = 'Details updated!';
          $location.path('/company/profile');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
  });
