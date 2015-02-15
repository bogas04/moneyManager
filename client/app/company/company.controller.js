'use strict';

angular.module('moneyManagerApp')
  .controller('CompanyCtrl', function ($scope, $http, AuthCompany, Company) {
    $scope.message = '';
    $scope.company = Company.get();
    /*
    $scope.createCompany = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.post('/api/company/company', $scope.create_company)
        .success( function (data, status, headers, config){
          console.log(data);
        })
        .error( function (data, status, headers, config){
          console.log(data);
        });
      }
    };
    */
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
