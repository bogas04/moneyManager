'use strict';

angular.module('moneyManagerApp')
.controller('CompanyCtrl', function ($routeParams, $scope, $location, $http, AuthCompany, Company) {
  $scope.message = '';
  $scope.company = Company.get();
  $scope.customers = [];
  $scope.agents = []; 
  $scope.currentCustomer = {};
  $scope.currentAgent = {};
  $scope.currentTerm = {};
  $scope.createThisCommittee = {};
  /* 
   * Filling Scopes
   */
  if($location.path().indexOf('/company/profile/customer/') > -1) {
    $http.get('/api/company/customers/'+$routeParams.id)
      .success( function (data, status, headers, config) {
        console.log(data, status, headers, config);
        $scope.currentCustomer = data;
        if($routeParams.termname) {
          for(var i = 0; i < data.terms.length; i++) {
            if(data.terms[i].title === $routeParams.termname) {
              $scope.currentTerm = data.terms[i];
              break;
            }
          }  
        }
      });
  }
  if($location.path().indexOf('/company/profile/committee/') > -1) {
    $http.get('/api/company/committees/'+$routeParams.committeeId)
      .success( function (data, status, headers, config) {
        console.log(data, status, headers, config);
        $scope.currentCommittee = data;
      });
  }
  if($location.path() === '/company/list/customer') {
    $http.get('/api/company/customers/')
      .success( function (data, status, headers, config) {
        $scope.customers = data;
        console.log(data, status, headers, config);
      })
    .error( function (data, status, headers, config) {
      console.log(data, status, headers, config);
    });
  }

  if($location.path().indexOf('/company/profile/agent/') > -1) {
    $http.get('/api/company/agents/'+$routeParams.id)
      .success( function (data, status, headers, config) {
        $scope.currentAgent = data;
        console.log(data, status, headers, config);
      });
  }
  if($location.path() === '/company/list/agent') {
    $http.get('/api/company/agents/')
      .success( function (data, status, headers, config) {
        $scope.agents = data;
        console.log(data, status, headers, config);
      })
    .error( function (data, status, headers, config) {
      console.log(data, status, headers, config);
    });
  }
  if($location.path() === '/company/list/committee') {
    $http.get('/api/company/committees/')
      .success( function (data, status, headers, config) {
        $scope.committees = data;
        console.log(data, status, headers, config);
      })
    .error( function (data, status, headers, config) {
      console.log(data, status, headers, config);
    });
  }
  if($location.path().indexOf('/company/create/committee') > -1) {
    $http.get('/api/company/customers/')
      .success( function (data, status, headers, config) {
        $scope.customers = data;
        console.log(data, status, headers, config);
      })
    .error( function (data, status, headers, config) {
      console.log(data, status, headers, config);
    });
  }

  /*
   * Committee Functions
   */

  $scope.updateCommittee = function(form) {
    $scope.submitted = true;
    console.log($scope.updateThisCommittee);
    if(form.$valid) {
      var newCommittee = $scope.updateThisCommittee;
      $http.put('/api/company/committees/'+$scope.currentCommittee._id, newCommittee)
        .success( function (data, status, headers, config){
          $location.path('company/list/committee');
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };
  $scope.deleteCommittee = function(committeeName) {
    console.log(committeeName);
    $http.delete('/api/company/committees/'+$routeParams.id)
      .success( function (data, status, headers, config){
        $location.path('company/list/committee/');
        console.log(data, status, headers, config);
      })
    .error( function (data, status, headers, config){
      console.log(data, status, headers, config);
    });
    return;
  };
  $scope.createCommittee = function(form) {
    $scope.submitted = true;
    console.log($scope.createThisCommittee);
    if(form.$valid) {
      var newCommittee = $scope.createThisCommittee;
      newCommittee.start_date = $scope.toDate(newCommittee.start_date);
      $http.post('/api/company/committees', newCommittee)
        .success( function (data, status, headers, config){
          $location.path('company/list/committee');
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };


  /*
   * Term Functions
   */

  $scope.updateTerm = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      var newTerm = $scope.currentTerm;
      newTerm.start_date = $scope.toDate(newTerm.start_date);
      var updatedCustomer = $scope.currentCustomer;
      for(var i = 0; i < updatedCustomer.terms.length; i++) {
        if(updatedCustomer.terms[i].title !== newTerm.title) {
          alert("This term doesn't exist!");
          $location.path('company/profile/customer/'+$scope.currentCustomer._id+'/terms');
          return;
        }
      }
      updatedCustomer.terms.push(newTerm);
      console.log(updatedCustomer);
      $http.put('/api/company/customers/'+$routeParams.id, updatedCustomer)
        .success( function (data, status, headers, config){
          $location.path('company/profile/customer/'+$scope.currentCustomer._id+'/terms');
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };

  $scope.deleteTerm = function(termName) {
    console.log(termName);
    for(var i = 0; i < $scope.currentCustomer.terms.length; i++) {
      if($scope.currentCustomer.terms[i].title === termName) {
        $scope.currentCustomer.terms.splice(i,1);
        $http.put('/api/company/customers/'+$routeParams.id, $scope.currentCustomer)
          .success( function (data, status, headers, config){
            $location.path('company/profile/customer/'+$scope.currentCustomer._id+'/terms');
            console.log(data, status, headers, config);
          })
        .error( function (data, status, headers, config){
          console.log(data, status, headers, config);
        });
        return;
      }
    }
    alert("Term not found!");
  };
  $scope.addTerm = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      var newTerm = $scope.addThisTerm;
      var d = newTerm.start_date.split('/');
      d = new Date(d[2], d[1] - 1, d[0]);
      newTerm.start_date = d;
      var updatedCustomer = $scope.currentCustomer;
      for(var i = 0; i < updatedCustomer.terms.length; i++) {
        if(updatedCustomer.terms[i].title === newTerm.title) {
          alert("This term already exists! Choose different name");
          $location.path('company/profile/customer/'+$scope.currentCustomer._id+'/terms');
          return;
        }
      }
      updatedCustomer.terms.push(newTerm);
      console.log(updatedCustomer);
      $http.put('/api/company/customers/'+$routeParams.id, updatedCustomer)
        .success( function (data, status, headers, config){
          $location.path('company/profile/customer/'+$scope.currentCustomer._id+'/terms');
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };

  /*
   * Log Functions
   */
  $scope.addLog = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      $scope.currentTerm.logs.push({ date : $scope.toDate($scope.addThisLog.date), paid : true });
      for(var i = 0; i < $scope.currentCustomer.terms.length; i++) {
        if($scope.currentCustomer.terms[i].title === $scope.currentTerm.title) {
          $scope.currentCustomer.terms[i] = $scope.currentTerm;
          $http.put('/api/company/customers/'+$routeParams.id, $scope.currentCustomer)
            .success( function (data, status, headers, config) {
              console.log(data, status, headers, config);
              $location.path('company/profile/customer/'+$scope.currentCustomer._id+'/terms/'+$scope.currentTerm.title+'/logs');
            })
          .error( function (data, status, headers, config){
            console.log(data, status, headers, config);
          });
        }
      } 
    } 
  }; 

  /*
   * Customer Functions
   */
  $scope.deleteCustomer = function(data) {
    $http.delete('/api/company/customers/'+data._id) 
      .success(function (data, status, headers, config) {
        console.log(data, status, headers, config);
        $location.path('company/list/customer/');
      })
    .error(function (data, status, headers, config) {
      console.log(data, status, headers, config);
    });
  };

  $scope.createCustomer = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      $http.post('/api/company/customers', $scope.createThisCustomer)
        .success( function (data, status, headers, config){
          $location.path('company/list/customer/');
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };
  $scope.updateCustomer = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      $http.put('/api/company/customers/'+$routeParams.id, $scope.updateThisCustomer)
        .success( function (data, status, headers, config){
          $location.path('company/list/customer/');
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };

  /*
   * Agent Functions
   */
  $scope.createAgent = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      $http.post('/api/company/agents', $scope.createThisAgent)
        .success( function (data, status, headers, config){
          $location.path('company/list/agent/');
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };

  /*
   * Company Functions
   */
  $scope.update = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      AuthCompany.update($scope.company.updated)
        .then( function() {
          $scope.message = 'Details updated!';
          $location.path('/company/profile');
        })
      .catch( function(err) {
        err = err.data;
        $scope.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, function(error, field) {
          form[field].$setValidity('mongoose', false);
          $scope.errors[field] = error.message;
        });
      });
    }
  };

  /*
   * Helper Functions
   */
  $scope.toggleMember = function(member) {
    if(!$scope.createThisCommittee.members) $scope.createThisCommittee.members = [];
    var index = $scope.createThisCommittee.members.indexOf(member);
    if(index > -1) {
      $scope.createThisCommittee.members.splice(index,1);
    } else {  
      $scope.createThisCommittee.members.push(member);
    }
    console.log($scope.createThisCommittee.members);
  }
  $scope.toDate = function (str) {
    // Return date object a dd/mm/yyyy string
    var d = str.split('/');
    return new Date(d[2], d[1] - 1, d[0]);
  };
  $scope.stringifyDate = function(str) {
    var d = new Date(str);
    var months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  };
});
