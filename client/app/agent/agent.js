'use strict';

angular.module('moneyManagerApp')
.config(function ($routeProvider) {
  $routeProvider
    .when('/agent', { // Company Related
      templateUrl: 'app/agent/agent.html',
      controller: 'AgentCtrl'
    })
  .when('/agent/profile', {
    templateUrl: 'app/agent/profile.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/notifications', {
    templateUrl: 'app/agent/notifications.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/list/agent', { // Agent Related
    templateUrl: 'app/agent/agent/list.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/agent/:id', {
    templateUrl: 'app/agent/agent/profile.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/update/agent/:id', {
    templateUrl: 'app/agent/agent/update.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/create/agent', {
    templateUrl: 'app/agent/agent/create.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/list/customer', { // Company Related
    templateUrl: 'app/agent/customer/list.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/create/customer', {
    templateUrl: 'app/agent/customer/create.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/update/customer/:id', {
    templateUrl: 'app/agent/customer/update.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/customer/:id', {
    templateUrl: 'app/agent/customer/profile.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/customer/:id/comments/', { // Customer Comments Related 
    templateUrl: 'app/agent/customer/comments.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/customer/:id/comments/add', { 
    templateUrl: 'app/agent/customer/add-comment.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/list/ledger', { // Customer Ledger Related
    templateUrl: 'app/agent/customer/ledger.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/list/terms', { // Customer Term Related
    templateUrl: 'app/agent/customer/all-terms.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/customer/:id/terms',  { 
    templateUrl: 'app/agent/customer/terms.html',
    controller: 'AgentCtrl'
  })  
  .when('/agent/profile/customer/:id/terms/add', {
    templateUrl: 'app/agent/customer/add-terms.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/customer/:id/terms/:termname', {
    templateUrl: 'app/agent/customer/view-term.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/customer/:id/logs', { // Customer Log Related
    templateUrl: 'app/agent/customer/all-logs.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/customer/:id/terms/:termname/logs', {
    templateUrl: 'app/agent/customer/logs.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/customer/:id/terms/:termname/logs/add', {
    templateUrl: 'app/agent/customer/add-logs.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/list/committee', { // Committee Related
    templateUrl: 'app/agent/committee/list.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/create/committee', {
    templateUrl: 'app/agent/committee/create.html',
    controller: 'AgentCtrl'
  })  
  .when('/agent/profile/committee/:committeeId', {
    templateUrl: 'app/agent/committee/profile.html',
    controller: 'AgentCtrl'
  })  
  .when('/agent/profile/committee/:committeeId/logs', {
    templateUrl: 'app/agent/committee/logs.html',
    controller: 'AgentCtrl'
  })
  .when('/agent/profile/committee/:committeeId/logs/add', {
    templateUrl: 'app/agent/committee/add-log.html',
    controller: 'AgentCtrl'
  });
});
