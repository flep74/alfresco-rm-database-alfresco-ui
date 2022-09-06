'use strict';

angular
  .module('openDeskApp.systemsettings')
  .controller('ForceunlockController', ForceunlockController);

function ForceunlockController($scope, $stateParams, $mdDialog, ContentService, HeaderService, $http, $filter, alfrescoDownloadService, $state, Toast ) {
  var vm = this;

  $scope.folderUuid = [];

  HeaderService.resetActions();

  vm.chartAval = "";
  vm.chartBval = "";

  vm.reportStarted = false;

  vm.createdFromDate = null;
  vm.createdToDate = null;

  vm.disableVentetiderButton = true;

  ("jeg er forceunlock")


    $scope.$watch('vm.createdFromDate', function (newVal) {
        if (newVal) {
            if (vm.createdToDate != null) {
                vm.disableVentetiderButton = false;

                vm.createdToDate= $filter('date')(vm.createdToDate,'yyyy-MM-dd');
            }
        }
        else {
            vm.disableVentetiderButton = true;
        }
    })

    $scope.$watch('vm.createdToDate', function (newVal) {
        if (newVal) {
            if (vm.createdFromDate != null) {
                vm.disableVentetiderButton = false;
                vm.createdFromDate= $filter('date')(vm.createdFromDate,'yyyy-MM-dd');
            }
        }
        else {
            vm.disableVentetiderButton = true;
        }
    })





    function testMail() {
        $http.post("/alfresco/s/conversions/script", { "properties" : {
            "method": "testmail",
            "uuid": "testmail"}
        }).then(function (response) {
            ("mail triggered");
            console.log(response);
        });
    }

    vm.testMail = testMail;


  function chartA() {
       $http.post("/alfresco/s/database/retspsyk/weeklystat", {
        "method": "spreadsheetA",
        "year": vm.chartAval
      }).then(function (response) {


           if (response.data.NodeRef == "") {
               alert("der er ikke data til at kunne lave en graf for det indtastede år")
           }
           else {
               // forward to previewmode
               $state.go('document', { doc: response.data.NodeRef, tmpcrumb: "", tmpNodeRef: "", showBackToReport : true });
               // ContentService.download("workspace://SpacesStore/" + response.data.NodeRef, "uge.ods");
           }


      });
  }
  vm.chartA = chartA;

  function chartB() {
      $http.post("/alfresco/s/database/retspsyk/weeklystat", {
          "method": "spreadsheetB",
          "year": vm.chartBval
      }).then(function (response) {

          if (response.data.NodeRef == "") {
              alert("der er ikke data til at kunne lave en graf for det indtastede år")
          }
          else {
              $state.go('document', { doc: response.data.NodeRef, tmpcrumb: "", tmpNodeRef: "", showBackToReport : true });
              // ContentService.download("workspace://SpacesStore/" + response.data.NodeRef, "aar.ods");
          }


      });
  }
  vm.chartB = chartB;

  function ventetidsRapport() {

      vm.reportStarted = true;

      var query = {};
      //
      // if (vm.createdFromDate != null) {
      //       vm.createdFromDate= $filter('date')(vm.createdFromDate,'yyyy-MM-dd');
      //       vm.createdToDate= $filter('date')(vm.createdToDate,'yyyy-MM-dd');
      //   }

      var postVarTO = "NOW";
      if (vm.createdToDate != null) {
          postVarTO = $filter('date')(vm.createdToDate,'yyyy-MM-dd')
      }

      $http.post("/alfresco/s/database/retspsyk/reports", {
          "method": "waitingtime",
          "createdFrom": $filter('date')(vm.createdFromDate,'yyyy-MM-dd'),
          "createdTo": postVarTO
      }).then(function (response) {
          vm.reportStarted = false;

          alfrescoDownloadService.downloadFile(response.data.spreadsheet, "download");

      });
  }

    vm.ventetidsrapport = ventetidsRapport;

  function verifyDataAndGetName() {

      $http.post("/alfresco/s/database/retspsyk/deleteobservand", {
          "method": "confirm",
          "caseNumber":  vm.sagsnr,
          "cpr": vm.cpr
      }).then(function (response) {
          $scope.cpr = vm.cpr.substring(0,6) + "-" + vm.cpr.substring(6,12);
          $scope.sagsnr = vm.sagsnr;

          if (response.data.found) {

              $scope.navn = response.data.navn;
              $scope.deleteObs = vm.deleteObs;

              $mdDialog.show({
                  templateUrl: 'app/src/system_settings/forceunlock/warning.view.html',
                  controller: 'ForceunlockController as vm',
                  clickOutsideToClose: true,
                  scope: $scope, // use parent scope in template
                  preserveScope: true, // do not forget this if use parent scope
              });

          }
          else {
              alert ("mismatch mellem cpr og sagsnummer");
          }


      });




  }
  vm.verifyDataAndGetName = verifyDataAndGetName;

  function removeLock() {
      $http.post("/alfresco/s/database/retspsyk/flowchart", {
          "properties": {"method" : "resetEditLock", "caseNumber" : $scope.sagsnr, "cpr" : $scope.cpr},
      }).then(function (response) {
          Toast.show('Låsen blev fjernet');
          $mdDialog.cancel();
      });
  }

  vm.removeLock = removeLock;

  function cancelDialog () {
       $mdDialog.cancel();
  }

  vm.cancelDialog = cancelDialog;






}



