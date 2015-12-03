'use strict';

angular.module('moneyManagerApp')
.controller('AdminCtrl', function ($routeParams, $scope, $location, $http, Auth, Admin) {
  Auth.isLoggedInAsync(function (loggedIn) {
    if(!loggedIn) {
      Auth.logout();
      $location.path('/');
    }
  });
  $scope.message = '';
  $scope.saveChanges = false;
  $scope.setSaveChanges = function() { $scope.saveChanges = true; $scope.errorInSavingChanges = false; $scope.savedChanges = false;};
  $scope.resetSaveChanges = function() { $scope.saveChanges = false; $scope.errorInSavingChanges = false; $scope.savedChanges = false;};
  $scope.toggleSaveChanges = function() { $scope.saveChanges = !$scope.saveChanges; };
  $scope.currentCompany = {};
  $scope.admin = Admin.get();
  if(Auth.isSuper) {
    $scope.admins = Admin.query();
  }


  if($location.path().indexOf('profile/company/') > -1) {
    $scope.saveChanges = false;
    $http.get('/api/admin/company/' + $routeParams.companyId)
      .success(function(data) { $scope.currentCompany = data; console.log(data); })
      .error(function(data) { console.log(data); });
  }
  $scope.createCompany = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      $http.post('/api/admin/company', $scope.createThisCompany)
        .success( function (data, status, headers, config){
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };
  $scope.updateCompany = function(company) {
    console.log(company);
    $http.put('/api/admin/company/' + $routeParams.companyId, company)
      .success(function(data) { $scope.resetSaveChanges(); $scope.savedChanges = true; })
      .error(function(data) { console.log(data); $scope.errorInSavingChanges = true; });

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
