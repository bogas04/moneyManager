'use strict';

angular.module('moneyManagerApp')
  .factory('Admin', function ($resource) {
    return $resource('/api/admin/:id/:controller', {
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
