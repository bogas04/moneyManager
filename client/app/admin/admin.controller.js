'use strict';

angular.module('moneyManagerApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, Admin) {
    $scope.message = '';
    $scope.admin = Admin.get();
    if(Auth.isSuper) {
      $scope.admins = Admin.query();
    }
    $scope.createCompany = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.post('/api/admin/company', $scope.create_company)
        .success( function (data, status, headers, config){
          console.log(data);
        })
        .error( function (data, status, headers, config){
          console.log(data);
        });
      }
    };
    $scope.update = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.update($scope.admin.updated)
        .then( function() {
          $scope.message = 'Details updated!';
          $location.path('/admin/profile');
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
