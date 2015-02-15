'use strict';

angular.module('moneyManagerApp')
  .factory('Company', function ($resource) {
    return $resource('/api/company/:id/:controller', {
      id: '@_id'
    },
    {
      update: {
        method: 'PUT',
        params: {
          controller:''
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
