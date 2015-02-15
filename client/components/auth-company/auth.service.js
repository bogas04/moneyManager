'use strict';

angular.module('moneyManagerApp')
  .factory('AuthCompany', function AuthCompany($location, $rootScope, $http, Company, $cookieStore, $q) {
    var currentCompany = {};
    if($cookieStore.get('token')) {
      currentCompany = Company.get();
    }

    return {

      /**
       * Authenticate company and save token
       *
       * @param  {Object}   company     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(company, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth-company/local', {
          username: company.username,
          password: company.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentCompany = Company.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and company info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentCompany = {};
      },

      /**
       * Create a new company
       *
       * @param  {Object}   company     - company info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
/*
      createCompany: function(company, callback) {
        var cb = callback || angular.noop;

        return Company.save(company,
          function(data) {
            $cookieStore.put('token', data.token);
            currentCompany = Company.get();
            return cb(company);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },
*/
      /**
       * Update 
       *
       * @param  {Object}   newDetails
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      update: function(newDetails, callback) {
        var cb = callback || angular.noop;
        return Company.update({ id: currentCompany._id }, newDetails, function(company) {
          return cb(company);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated company
       *
       * @return {Object} company
       */
      getCurrentCompany: function() {
        return currentCompany;
      },

      /**
       * Check if a company is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentCompany.hasOwnProperty('owner');
      },

      /**
       * Waits for currentCompany to resolve before checking if company is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentCompany.hasOwnProperty('$promise')) {
          currentCompany.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentCompany.hasOwnProperty('owner')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a company is an company
       *
       * @return {Boolean}
       */
      /*
      isSuper: function() {
        return currentCompany.isSuper;
      },
      */
      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
