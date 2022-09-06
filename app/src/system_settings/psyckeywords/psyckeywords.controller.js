'use strict';

angular
  .module('openDeskApp.systemsettings')
  .controller('PsyckeywordsController', PsycKeywords);

function PsycKeywords($scope, $stateParams, $mdDialog, ContentService, HeaderService, $http, $filter, alfrescoDownloadService, $state ) {
  var vm = this;

  $scope.folderUuid = [];

  HeaderService.resetActions();

  $scope.listContent = [];
  $scope.listTitle = "Vedligeholdelse af standardformuleringer";
  $scope.newEntry = '';
  $scope.selected = undefined;

  function renameDialog(content) {
      console.log("hvad er content")
      console.log(content);

      $scope.selected = content;
      $scope.newEntry = content.label;

      $mdDialog.show({
          templateUrl: 'app/src/system_settings/psyckeywords/list-rename.html',
          scope: $scope, // use parent scope in template
          preserveScope: true, // do not forget this if use parent scope
          clickOutsideToClose: true
      });

  }
  $scope.renameDialog = renameDialog;


  function rename() {
      console.log("save id:");
      console.log($scope.selected.id);
      console.log($scope.newEntry);

      return $http.post("/alfresco/s/database/retspsyk/psyc", {
          "properties" : {"method" : "updateKonklusionTag", "id" : $scope.selected.id, "newValue" : $scope.newEntry}
      }).then(function (response) {
          console.log("response fra save");
          console.log(response);
          $mdDialog.cancel();
          getKonklusionTags();
      });


  }

  $scope.rename = rename;

  function cancelDialog () {
       $mdDialog.cancel();
  }

    function getKonklusionTags() {
        return $http.post("/alfresco/s/database/retspsyk/psyc", {
            "properties" : {"method" : "getKonklusionTags"}
        }).then(function (response) {

            console.log("konklusionTags");
            console.log(response.data.data);
            $scope.listContent = response.data.data;

            return response.data;
        });
    }

  vm.getKonklusionTags = getKonklusionTags;

  vm.getKonklusionTags();

  vm.cancelDialog = cancelDialog;

  function addNewDialog() {

      $scope.newEntry = "";

      $mdDialog.show({
          templateUrl: 'app/src/system_settings/psyckeywords/newpsyckeyword.html',
          scope: $scope, // use parent scope in template
          preserveScope: true, // do not forget this if use parent scope
          clickOutsideToClose: true
      });
  }

  vm.addNewDialog = addNewDialog;

  function addNew(newObject) {
      $http.post("/alfresco/s/database/retspsyk/psyc", {
          "properties" : {"method" : "createKonklusionTag", "newValue" : newObject}
      }).then(function (response) {
          $mdDialog.cancel();
          getKonklusionTags();
      });
  }

  vm.addNew = addNew;







}



