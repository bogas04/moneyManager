'use strict';

angular.module('moneyManagerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, AuthCompany) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = function () {
      return Auth.isLoggedIn() || AuthCompany.isLoggedIn();
      //return AuthCompany.isLoggedIn();
    };
    $scope.isAdmin = Auth.isAdmin;
    $scope.isCompany = AuthCompany.isLoggedIn;

    $scope.getCurrentAdmin = Auth.getCurrentAdmin;  
    $scope.getCurrentCompany = AuthCompany.getCurrentCompany;

    $scope.logout = function() {
      Auth.logout();
      AuthCompany.logout();
      $location.path('/');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
