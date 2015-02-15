'use strict';

angular.module('moneyManagerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/agent', {
        templateUrl: 'agent/agent.html',
        controller: 'AgentCtrl'
      });
  });
