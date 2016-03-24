// Obdi - a REST interface and GUI for deploying software
// Copyright (C) 2014  Mark Clarkson
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ------------------------------------------------------------------------
// AngularJS Controller
// ------------------------------------------------------------------------

mgrApp.controller("helloWorldMinimal", function ($scope,$http,$uibModal,$log,
      $timeout,baseUrl,$rootScope) {

  $scope.environments = [];
  $scope.env = {};

  // Pages
  $scope.mainview = true;

  // Alerting
  $scope.message = "";
  $scope.mainmessage = "";
  $scope.okmessage = "";
  $scope.login.error = false;

  // Hiding/Showing
  $scope.showkeybtnblockhidden = false;
  $scope.btnsayhellodisabled = true;
  $scope.btnsayhellopressed = false;
  $scope.btnenvlistdisabled = false;
  $scope.envchosen = false;
  $scope.status = {};

  $rootScope.$broadcast( "searchdisabled", true );

  // ----------------------------------------------------------------------
  $scope.$on( "search", function( event, args ) {
  // ----------------------------------------------------------------------
    if( $scope.grainsview.show == false ) {
      $scope.hostfilter = args;
      $scope.checkbox_allnone = false;
      for( var i=0; i < $scope.servernames.length; i=i+1 ) {
        $scope.servernames[i].Selected = false;
      }
      ReviewBtnStatus();
    } else {
      $scope.grainfilter = args;
    }
  });

  // ----------------------------------------------------------------------
  var clearMessages = function() {
  // ----------------------------------------------------------------------
    $scope.message = "";
    $scope.mainmessage = "";
    $scope.okmessage = "";
    $scope.login.error = false;
    $scope.error = false;
  }

  // ----------------------------------------------------------------------
  $scope.Restart = function() {
  // ----------------------------------------------------------------------
    clearMessages();
    $scope.btnsayhellodisabled = true;
    $scope.btnenvlistdisabled = false;
    $scope.envchosen = false;
  };

  // ----------------------------------------------------------------------
  $scope.envChoice = function( envobj, $event ) {
  // ----------------------------------------------------------------------
    clearMessages();
    $event.preventDefault();
    $event.stopPropagation();
    $scope.envchosen = true;
    $scope.btnenvlistdisabled = true;
    $scope.env = envobj;
    $scope.btnsayhellodisabled = false;
    $scope.status.isopen = !$scope.status.isopen;
  };

  // ----------------------------------------------------------------------
  $scope.GoBack = function( ) {
  // ----------------------------------------------------------------------
    clearMessages();
    $scope.mainview = true;
    $scope.btnenvlistdisabled = true;
    $scope.btnsayhellodisabled = false;

    $rootScope.$broadcast( "setsearchtext", $scope.hostfilter );
  }

  // ----------------------------------------------------------------------
  $scope.FillEnvironmentsTable = function() {
  // ----------------------------------------------------------------------

    $http({
      method: 'GET',
      url: baseUrl + "/" + $scope.login.userid + "/" + $scope.login.guid
           + "/envs?writeable=1"
           + '&time='+new Date().getTime().toString()
    }).success( function(data, status, headers, config) {

      $scope.environments = data;
      if( data.length == 0 ) {
        $scope.serverlist_empty = true;
        $scope.btnenvlistdisabled = true;
      }

    }).error( function(data,status) {
      if (status>=500) {
        $scope.login.errtext = "Server error.";
        $scope.login.error = true;
        $scope.login.pageurl = "login.html";
      } else if (status==401) {
        $scope.login.errtext = "Session expired.";
        $scope.login.error = true;
        $scope.login.pageurl = "login.html";
      } else if (status>=400) {
        clearMessages();
        $scope.mainmessage = "Server said: " + data['Error'];
      } else if (status==0) {
        // This is a guess really
        $scope.login.errtext = "Could not connect to server.";
        $scope.login.error = true;
        $scope.login.pageurl = "login.html";
      } else {
        $scope.login.errtext = "Logged out due to an unknown error.";
        $scope.login.error = true;
        $scope.login.pageurl = "login.html";
      }
    });
  };

  $scope.FillEnvironmentsTable();

  // Modal dialog

  // --------------------------------------------------------------------
  $scope.helloDialog = function () {
  // --------------------------------------------------------------------

    var name = $scope.env.DispName;

    var modalInstance = $uibModal.open({
      templateUrl: 'helloModal.html',
      controller: $scope.ModalInstanceCtrl,
      size: 'sm',
      resolve: {
        // the name variable is passed to the ModalInstanceCtrl
        name: function () {
          return name;
        }
      }
    });

    modalInstance.result.then(function (name) {
      $log.info('Will do something with: ' + $scope.name );
      //
      // Call a function to do something here
      //
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  // --------------------------------------------------------------------
  $scope.ModalInstanceCtrl = function ($scope, $uibModalInstance, name) {
  // --------------------------------------------------------------------

    // So the template can access 'name' in this new scope
    $scope.name = name;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  };

});
