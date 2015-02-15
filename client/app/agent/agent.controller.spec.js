'use strict';

describe('Controller: AgentCtrl', function () {

  // load the controller's module
  beforeEach(module('moneyManagerApp'));

  var AgentCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgentCtrl = $controller('AgentCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
