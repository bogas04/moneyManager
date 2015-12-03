'use strict';

angular.module('moneyManagerApp')
  .factory('Agent', function ($resource) {
    return $resource('/api/agent/:id/:controller', {
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
