'use strict';

angular.module('moneyManagerApp')
.filter('hasTerm', function () {
 return function(customers, term) {
    term = term ? String.trim(term) : "";
    if(term === "" || !customers) { 
      return customers;
    }
    var customersWithTerm = [];
    for(var i = 0; i < customers.length; i++) { // For each customer
      var found = false;
      for(var j = 0; !found && j < customers[i].terms.length; j++) { // For each term
        if(String.toLowerCase(customers[i].terms[j].title).indexOf(String.toLowerCase(term)) > -1) {
          found = true;
          customersWithTerm.push(customers[i]);
        }
      }
    }
    return customersWithTerm;
  };
})
.controller('CompanyCtrl', function ($routeParams, $scope, $location, $http, AuthCompany, Company) {
  AuthCompany.isLoggedInAsync(function (loggedIn) {
    if(!loggedIn) {
      AuthCompany.logout();
      $location.path('/');
    }
  });
  $scope.message = '';
  $scope.company = Company.get();
  $scope.customers = [];
  $scope.agents = []; 
  $scope.currentCustomer = {};
  $scope.currentAgent = {};
  $scope.currentTerm = {};
  $scope.memberCount = [];
  $scope.addThisCommitteeLog = { takenBy : null };
  $scope.createThisCommittee = { duration : { parameter : 'months' }, members : { list : [], count : 0 } };
  $scope.addThisTerm = { interest : { type : 'simple', rate : 0 }, installments : { duration : { parameter : 'months', count : 0}, count : 0}};
  $scope.addThisLog = { type  : 'credit'};
  /* 
   * Filling Scopes
   */
  // Customer Profile
  if($location.path().indexOf('/company/profile/customer/') > -1) {
    $http.get('/api/company/customers/'+$routeParams.id)
      .success( function (data, status, headers, config) {
        console.log(data, status, headers, config);
        $scope.currentCustomer = data;
        if($routeParams.termname) {
          for(var i = 0; i < data.terms.length; i++) {
            if(data.terms[i].title === $routeParams.termname) {
              $scope.currentTerm = data.terms[i];
              if($location.path().indexOf('logs/add') > -1) {
                $scope.addThisLog.amount = $scope.computeLogAmount(data.terms[i]);
                $scope.addThisLog.date = $scope.slashifyDate(new Date().getTime());
              }
              break;
            }
          }  
        }
      });
  }
  // Customer List
  if( $location.path().indexOf('company') > -1 ) {
    $http.get('/api/company/customers/')
      .success( function (data) {
        $scope.customers = data;
        console.log(data);
      })
    .error( function (data) {
      console.log(data);
    });
  }
  // Agent Profile
  if($location.path().indexOf('/company/profile/agent/') > -1) {
    $http.get('/api/company/agents/'+$routeParams.id)
      .success( function (data, status, headers, config) {
        $scope.currentAgent = data;
        console.log(data, status, headers, config);
      });
  }
  // Agent List
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
  // Committee Profile
  if($location.path().indexOf('/company/profile/committee/') > -1) {
    $http.get('/api/company/committees/'+$routeParams.committeeId)
      .success( function (data) {
        $scope.currentCommittee = data;
        if($location.path().indexOf('/logs/add') > -1) {
          $scope.addThisCommitteeLog = { bidAmount : data.amount / data.duration.count } ;
          $scope.committeeLogOfAmount = [];
          for(var i = 0; i < data.members.list.length; i++) {
            $scope.committeeLogOfAmount[data.members.list[i].details._id] = $scope.addThisCommitteeLog.bidAmount;
          }
        }
      });
  }
  // Committee List
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
  // Committee Create
  if($location.path().indexOf('/company/create/committee') > -1) {
    $http.get('/api/company/customers/')
      .success( function (data, status, headers, config) {
        $scope.customers = data;
        for(var i = 0; i < data.length; i++) {
          $scope.memberCount[data[i]._id] = 0;
        }
        console.log(data, status, headers, config);
      })
    .error( function (data, status, headers, config) {
      console.log(data, status, headers, config);
    });
  }
  // Term Create
  $scope.updateTermDuration = function() {
    console.log($scope.addThisTerm);
    if(!$scope.addThisTerm.start_date || 
       !$scope.addThisTerm.end_date ||
       $scope.addThisTerm.start_date.indexOf('/') < 0 || 
       $scope.addThisTerm.end_date.indexOf('/') < 0 ||
       $scope.addThisTerm.installments.count < 1) { 
      return; 
    }
    var start = $scope.toDate($scope.addThisTerm.start_date);
    var end = $scope.toDate($scope.addThisTerm.end_date);
    var nInstallments = $scope.addThisTerm.installments.count;
    var diff = end.getTime() - start.getTime();
    var totalDays = Math.ceil(diff/(1000*60*60*24));
    var daysInEachInstallment = Math.ceil(totalDays/nInstallments);
    console.log(daysInEachInstallment);
    if(daysInEachInstallment < 30) {
      $scope.addThisTerm.installments.duration.count = Math.floor(daysInEachInstallment);
      $scope.addThisTerm.installments.duration.parameter = 'days';
    } else if(daysInEachInstallment < 365) {
      $scope.addThisTerm.installments.duration.count = Math.floor(daysInEachInstallment/30);
      $scope.addThisTerm.installments.duration.parameter = 'months';
    } else {
      $scope.addThisTerm.installments.duration.count = Math.floor(daysInEachInstallment/365);
      $scope.addThisTerm.installments.duration.parameter = 'years';

    }
  };
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
  $scope.addCommitteeLog = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      var logDetails = $scope.addThisCommitteeLog;
      logDetails.date = $scope.toDate(logDetails.date);

      // Update all customers 
      for(var i = 0; i < $scope.currentCommittee.members.list.length; i++) {
        // Change Terms
        var termIndex = $scope.getTermIndex($scope.currentCommittee.members.list[i].details.terms, $scope.currentCommittee.title);      
        if(termIndex === -1) { // First meeting
          termIndex = $scope.currentCommittee.members.list[i].details.terms.push({ // Add the term
            title : $scope.currentCommittee.title,
            start_date : $scope.currentCommittee.start_date, 
            logs : [{ // Add the log
              date : logDetails.date,
              type : 'debit',
              amount : $scope.committeeLogOfAmount[$scope.currentCommittee.members.list[i].details._id]
            }]
          }) - 1; 
        } else { // Subsequent meeting
          $scope.currentCommittee.members.list[i].details.terms[termIndex].logs.push({ // Add the log
            date : logDetails.date,
            type : 'debit',
            amount : $scope.committeeLogOfAmount[$scope.currentCommittee.members.list[i].details._id]
          });
        }
        // If this member took the money
        if($scope.currentCommittee.members.list[i].details._id === $scope.addThisCommitteeLog.takenBy) {
          // Add to credit
          $scope.currentCommittee.members.list[i].details.terms[termIndex].logs.push({
            date : logDetails.date,
            type : 'credit',
            amount : $scope.addThisCommitteeLog.bidAmount * $scope.currentCommittee.members.count
          });
          console.log('This member takes the money', $scope.currentCommittee.members.list[i].details);
        } 
        // Updating Customer
        $scope._updateCustomer($scope.currentCommittee.members.list[i].details);
        // deleting customer info to ready for database
        $scope.currentCommittee.members.list[i].details = $scope.currentCommittee.members.list[i].details._id;
      } 
      // pushing the logs
      $scope.currentCommittee.logs.push($scope.addThisCommitteeLog);
      $http.put('/api/company/committees/'+$scope.currentCommittee._id, $scope.currentCommittee)
        .success(function(data) {
          console.log(data);
         $location.path('/company/profile/committee/'+$scope.currentCommittee._id);
        })
      .error(function(data) {
        console.log(data);
      });
      console.log($scope.currentCommittee);
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
  };
  $scope.addTerm = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      var newTerm = $scope.addThisTerm;
      newTerm.start_date = $scope.toDate(newTerm.start_date);
      newTerm.end_date = $scope.toDate(newTerm.end_date);
      newTerm.logs = [{
        date : newTerm.start_date,
        amount : newTerm.amount,
        type : 'debit'
      }];
      var updatedCustomer = $scope.currentCustomer;
      for(var i = 0; i < updatedCustomer.terms.length; i++) {
        if(updatedCustomer.terms[i].title === newTerm.title) {
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
    } else {
    }
  };

  /*
   * Log Functions
   */
  $scope.addLog = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      $scope.addThisLog.date = $scope.toDate($scope.addThisLog.date);
      $scope.currentTerm.logs.push($scope.addThisLog);
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
          return; 
        }
      } 
    } 
  }; 
  $scope.deleteLog = function(log) {
    for(var i = 0; i < $scope.currentTerm.logs.length; i++) {
      if($scope.currentTerm.logs[i].date === log.date &&
          $scope.currentTerm.logs[i].amount === log.amount &&
          $scope.currentTerm.logs[i].type === log.type) {
        $scope.currentTerm.logs.splice(i, 1);
        for(i = 0; i < $scope.currentCustomer.terms.length; i++) {
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
            return;
          }
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
    if(form.phone.$modelValue) {
      if(form.phone.$modelValue.length != 10) {
        form.phone.$setValidity('invalid', false);
        return;
      } else {
        form.phone.$setValidity('invalid', true);
      }
    }
    if(form.$valid) {
      $http.post('/api/company/customers', $scope.createThisCustomer)
        .success( function (data, status, headers, config){
          $location.path('company/list/terms/');
          console.log(data, status, headers, config);
        })
      .error( function (data, status, headers, config){
        console.log(data, status, headers, config);
      });
    }
  };
  $scope._updateCustomer = function(customer) {
    $http.put('/api/company/customers/'+customer._id, customer)
      .success( function (data, status, headers, config){
        $location.path('company/list/customer/');
        console.log(data, status, headers, config);
      })
    .error( function (data, status, headers, config){
      console.log(data, status, headers, config);
    });
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
  $scope.capInit = function (str) { return (!str) ? str : str[0].toUpperCase() + str.slice(1); }; 
  
  // Reminder Helper Function
  $scope.isToBeCollected = function(term, inDays) {
    var termDate = new Date(term.start_date);
    var endDate = new Date(term.end_date);
    var today = new Date();
    var lastDate = null;
    for(var i = 0;i < term.logs.length; i++) {
      if(term.logs[i].type === 'credit') {
        lastDate = term.logs[i].date;
      }
    }
    return  (today.getDate() === termDate.getDate() - inDays) && // Term date is yesterday today or tomorrow
            (!lastDate || // and didn't ever credited
            lastDate.getMonth() !== today.getMonth()); // Or didn't credit this month
           
  };
  
  // Term Helper Functions
  $scope.creditOrDebit = function(str) { return str === 'credit'? 'danger' : 'success'; };
  $scope.isCredit = function(logType) { return logType === 'credit'?true:false; };
  $scope.computeBalance = function (term) {
    var balance = 0;
    for(var i = 0; i < term.logs.length; i++) {
      if(term.logs[i].type === 'credit') {
        balance += term.logs[i].amount;
      } else {
        balance -= term.logs[i].amount;
      }
    }
    return $scope.roundTo(balance);
  }; 
  
  // Log Helper Functions
  $scope.logsWithBalance = function(logs) {
    if(!logs) { return logs; }
    var balance = 0;
    for(var i = 0; i < logs.length; i++) {
      if(logs[i].type === 'credit') {
        balance += logs[i].amount;
      } else {
        balance -= logs[i].amount;
      }
      logs[i].balance = $scope.roundTo(balance);
    }
    return logs;
  };
  $scope.computeLogAmount = function(term) {
    return $scope.roundTo(term.amount * term.interest.rate * 0.01);
  };
  $scope.roundTo = function(number, precision) {
    if(!number) { return number; }
    var _number = parseInt(number);
    if(_number === number) { return number; }
    if(Math.abs(number) < 1) { return 0; }
    precision = precision || 2;
    return number.toPrecision((_number + "").length + precision);
  };
  $scope.getSortedLogsWithBalance = function(customer) {
    var logs = [];
    if(!customer || !customer.terms) {
      return logs;
    }
    
    // Accumulate
    for(var i = 0; i < customer.terms.length; i++) {
      for(var j = 0; j < customer.terms[i].logs.length; j++) {
        customer.terms[i].logs[j].termTitle = customer.terms[i].title;
        logs.push(customer.terms[i].logs[j]);
      }
    };
    
    // Sort
    Array.sort(logs, function(a, b) {
      return a.date > b.date;
    });
    
    // Add Balance
    var balance = 0;
    for(i = 0; i < logs.length; i++) {
      balance = balance + ($scope.isCredit(logs[i].type)?1:-1)*logs[i].amount;
      logs[i].balance = $scope.roundTo(balance);
    }

    return logs;
  };

  // Committee Helper Functions
  $scope.hasTaken = function(id) {
    for(var i = 0; i < $scope.currentCommittee.logs.length; i++) {
      if($scope.currentCommittee.logs[i].takenBy === id) {
        return true;
      }
    }
    return false;
  };
  $scope.updateTakenBy = function(id) {
    $scope.addThisCommitteeLog.takenBy = id;
    console.log($scope.addThisCommitteeLog);
  };
  $scope.getTermIndex = function(terms, title) {
    var index = -1;
    for(var i = 0, found = false; !found && i < terms.length; i++) {
      if(terms[i].title === title) {
        index = i;
        found = true;
      }
    }
    return index;
  };
  $scope.getMemberIndex = function (member) {
    var index = -1;
    for(var i = 0, found = false;!found && i < $scope.createThisCommittee.members.list.length; i++) {
      if($scope.createThisCommittee.members.list[i].details === member) {
        index = i;
        found = true;
      }
    }
    return index;
  };
  $scope.getRemainingMemberCount = function() {
    return $scope.createThisCommittee.members.count - $scope.getMemberCount();
  };
  $scope.getMemberCount = function() {
    var sum = 0;
    for(var i in $scope.memberCount) {
      sum += $scope.memberCount[i];
    }
    return sum;
  };
  $scope.toggleMember = function(member) {
    if($scope.createThisCommittee.members.count === 0) {
      return;
    }
    var index = $scope.getMemberIndex(member);
    if(index > -1) {
      $scope.memberCount[member] = 0;
      $scope.createThisCommittee.members.list.splice(index,1);
    } else if($scope.createThisCommittee.members.count > 0 &&
        $scope.createThisCommittee.members.list.length < $scope.createThisCommittee.members.count){
      $scope.memberCount[member] = $scope.memberCount[member] || 1;
      $scope.createThisCommittee.members.list.push({ details : member, count : $scope.memberCount[member]});
    }
    console.log($scope.createThisCommittee.members.list);
  };

  // Date Helper Functions
  $scope.toDate = function (str) {
    // Return date object a dd/mm/yyyy string
    var d = str.split('/');
    return new Date(d[2], d[1] - 1, d[0]);
  };
  $scope.isDate = function (dateString) {
    var validDate = /^(([0][1-9])|([1-2][0-9])|([3][0-1]))\/(([0][1-9])|([1][0-2]))\/[0-9]{4}$/; 
    return dateString &&validDate.test(dateString);
  };
  $scope.slashifyDate = function(str) {
    var d = new Date(str);
    if(d === "Invalid Date") { return null; }
    return d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
  };
  $scope.stringifyDate = function(str) {
    var d = new Date(str);
    if(d === "Invalid Date") { return null; }
    var months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  };
});
