'use strict';

angular.module('moneyManagerApp')
  .factory('Auth', function Auth($location, $rootScope, $http, Admin, $cookieStore, $q) {
    var currentAdmin = {};
    if($cookieStore.get('token')) {
      currentAdmin = Admin.get();
    }

    return {

      /**
       * Authenticate admin and save token
       *
       * @param  {Object}   admin     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(admin, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: admin.email,
          password: admin.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentAdmin = Admin.get();
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
       * Delete access token and admin info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentAdmin = {};
      },

      /**
       * Create a new admin
       *
       * @param  {Object}   admin     - admin info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createAdmin: function(admin, callback) {
        var cb = callback || angular.noop;

        return Admin.save(admin,
          function(data) {
            $cookieStore.put('token', data.token);
            currentAdmin = Admin.get();
            return cb(admin);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Update 
       *
       * @param  {Object}   newDetails
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      update: function(newDetails, callback) {
        var cb = callback || angular.noop;
        return Admin.update({ id: currentAdmin._id }, newDetails, function(admin) {
          return cb(admin);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated admin
       *
       * @return {Object} admin
       */
      getCurrentAdmin: function() {
        return currentAdmin;
      },

      /**
       * Check if a admin is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentAdmin.hasOwnProperty('isSuper');
      },

      /**
       * Waits for currentAdmin to resolve before checking if admin is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentAdmin.hasOwnProperty('$promise')) {
          currentAdmin.$promise.then(function() {
            cb(true);
          }).catch(function() {
            currentAdmin = {};
            cb(false);
          });
        } else if(currentAdmin.hasOwnProperty('isSuper')) {
          cb(true);
        } else {
          currentAdmin = {};
          cb(false);
        }
      },

      /**
       * Check if a admin is an admin
       *
       * @return {Boolean}
       */
      isSuper: function() {
        return currentAdmin.isSuper;
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
