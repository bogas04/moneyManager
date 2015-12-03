'use strict';

angular.module('moneyManagerApp')
  .factory('AuthAgent', function Auth($location, $rootScope, $http, Agent, $cookieStore, $q) {
    var currentAgent = {};
    if($cookieStore.get('token')) {
      currentAgent = Agent.get();
    }

    return {

      /**
       * Authenticate agent and save token
       *
       * @param  {Object}   agent     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(agent, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth-agent/local', {
          username: agent.username,
          email: agent.email,
          password: agent.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentAgent = Agent.get();
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
       * Delete access token and agent info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentAgent = {};
      },

      /**
       * Create a new agent
       *
       * @param  {Object}   agent     - agent info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createAgent: function(agent, callback) {
        var cb = callback || angular.noop;

        return Agent.save(agent,
          function(data) {
            $cookieStore.put('token', data.token);
            currentAgent = Agent.get();
            return cb(agent);
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
        return Agent.update({ id: currentAgent._id }, newDetails, function(agent) {
          return cb(agent);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated agent
       *
       * @return {Object} agent
       */
      getCurrentAgent: function() {
        return currentAgent;
      },

      /**
       * Check if a agent is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentAgent.hasOwnProperty('company');
      },

      /**
       * Waits for currentAgent to resolve before checking if agent is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentAgent.hasOwnProperty('$promise')) {
          currentAgent.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentAgent.hasOwnProperty('company')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a agent is an agent
       *
       * @return {Boolean}
       */
      company: function() {
        return currentAgent.company;
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
