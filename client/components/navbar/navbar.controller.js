'use strict';

angular.module('moneyManagerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, AuthCompany, AuthAgent) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = { primary :true, secondary : true };  
    $scope.isLoggedIn = function () {
      return Auth.isLoggedIn() || AuthCompany.isLoggedIn() || AuthAgent.isLoggedIn();
      //return AuthCompany.isLoggedIn();
    };
    $scope.isAdmin = Auth.isLoggedIn;
    $scope.isCompany = AuthCompany.isLoggedIn;
    $scope.isAgent = AuthAgent.isLoggedIn;

    $scope.getCurrentAdmin = Auth.getCurrentAdmin;  
    $scope.getCurrentCompany = AuthCompany.getCurrentCompany;
    $scope.getCurrentAgent = AuthAgent.getCurrentAgent;

    $scope.logout = function() {
      Auth.logout();
      AuthCompany.logout();
      AuthAgent.logout();
      $location.path('/');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
