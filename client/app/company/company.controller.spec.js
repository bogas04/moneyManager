'use strict';

describe('Controller: CompanyCtrl', function () {

  // load the controller's module
  beforeEach(module('moneyManagerApp'));

  var CompanyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyCtrl = $controller('CompanyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
