'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationController', DeclarationController);

function DeclarationController($scope, propertyService, $rootScope, HeaderService, $mdDialog, $state, $stateParams, DeclarationService) {

  console.log("hvad er $stateParams");
  console.log($stateParams)


  function gotoDocuments() {
    $state.go('declaration.show.documents', {
      breadcrumbPath: [],
      tmpNodeRef: null,
      emailPayload: null
    }, {reload: true}).then(function (response) {
      console.log(response)
    });
  }

  function gotoPsyc() {
    $state.go('declaration.show.psyc', {
      breadcrumbPath: [],
      tmpNodeRef: null,
      emailPayload: null,
    }).then(function (response) {
      console.log(response)
    });
  }

  $scope.gotoDocuments = gotoDocuments;
  $scope.gotoPsyc = gotoPsyc;



  var vm = this;

  $scope.case = {};
  $scope.propertyValues = propertyService.getAllPropertyValues();

  function clearList() {
    $rootScope.duf = null;
  }
   $scope.clearList = clearList();

  $scope.authorityMailDialogMulti = authorityMailDialog;

  function authorityMailDialog() {
    $scope.selectedContent = $rootScope.duf;

    $mdDialog.show({
      templateUrl: 'app/src/authorityMail/authorityMail.view.html',
      controller: 'AuthorityMailController as vm',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: false
    }).then(function (response) {
      $scope.clearList();
      $state.go('declaration.show.documents', { caseid: $stateParams.caseid, breadcrumbPath: [], tmpNodeRef : $stateParams.breadcrumbPath[0].nodeUuid, emailPayload : undefined, selectedFiles :  undefined});
    }).catch(function (response) {
      $scope.clearList();
      $state.go('declaration.show.documents', { caseid: $stateParams.caseid, breadcrumbPath: [], tmpNodeRef : $stateParams.breadcrumbPath[0].nodeUuid, emailPayload : undefined, selectedFiles :  undefined});
    });
  }





  $scope.clearList = clearList;

  $scope.showMailAttachments = false;

  $rootScope.$watch('duf', function (newVal) {
    if (newVal) {
      $scope.duf = newVal;
      $scope.showMailAttachments = true;
    }
    else {
      $scope.duf = undefined;
      $scope.showMailAttachments = false;
    }
  });



  $scope.agents = propertyService.getAllPropertyValuesForHenvisende();

  console.log("agents");


}

