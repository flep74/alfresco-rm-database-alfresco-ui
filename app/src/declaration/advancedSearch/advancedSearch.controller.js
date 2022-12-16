'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('AdvancedSearchController', AdvancedSearchController);

function AdvancedSearchController($scope, $state, $translate, DeclarationService, filterService, propertyService, HeaderService, $filter, $stateParams) {

  var vm = this;

  $scope.searchParams = {}

  vm.searchResults = [];
  vm.totalResults = 0;
  vm.next = 0;
  vm.isLoading = false;
  $scope.showResults = false;
  vm.gotoCase = gotoCase;
  $scope.propertyValues = propertyService.getAllPropertyValues();
  $scope.propertyFilter = propertyFilter;

  vm.printFriendlytStarted = false;
  vm.toggleResults = toggleResults;
  vm.advancedSearch = advancedSearch;
  vm.nextPage = nextPage;
  vm.clearResults = clearResults;
  vm.evalAll = evalAll;
  vm.transformChip = transformChip;
  vm.ChipHD = ChipHD;
  vm.ChipMD = ChipMD;
  vm.ChipSP = ChipSP;
  vm.ChipSTATUS = ChipSTATUS;
  vm.ChipDOCTOR = ChipDOCTOR;
  vm.ChipSUPERVISOR = ChipSUPERVISOR;
  vm.ChipSOCIAL = ChipSOCIAL;
  vm.ChipPSYC = ChipPSYC;
  vm.selectedCharge = null;
  vm.selectedDiagnosis = null;
  vm.selectedPlacement = null;
  vm.sanctionProposal = null;
  vm.selectedStatus = null;
  vm.selectedDoctor = null;
  vm.selectedPSYC = null;
  vm.selectedSOCIAL = null;
  vm.selectedSUPERVISOR = null;
  vm.selectedSanctionProposal = null;

  vm.showSearch = {};

  $scope.searchParams.bua = "PS";
  $scope.searchParams.closed = "CLOSED";

  if (Object.keys($stateParams.searchquery).length) {
        $scope.searchParams = $stateParams.searchquery;

        // unset the printfriendly property when coming back from the preview document view
        if ($scope.searchParams.hasOwnProperty("preview")) {
          $scope.searchParams.preview = undefined;
        }


  }
  if (!$scope.searchParams.mainCharge) {
    $scope.searchParams.mainCharge = []
  }

  if (!$scope.searchParams.mainDiagnosis) {
    $scope.searchParams.mainDiagnosis = []
  }

  if (!$scope.searchParams.placement) {
    $scope.searchParams.placement = []
  }

  if (!$scope.searchParams.sanctionProposal) {
    $scope.searchParams.sanctionProposal = []
  }

  if (!$scope.searchParams.status) {
    $scope.searchParams.status = []
  }

  if (!$scope.searchParams.doctor) {
    $scope.searchParams.doctor = []
  }

  if (!$scope.searchParams.socialworker) {
    $scope.searchParams.socialworker = []
  }

  if (!$scope.searchParams.supervisingDoctor) {
    $scope.searchParams.supervisingDoctor = []
  }

  if (!$scope.searchParams.psychologist) {
    $scope.searchParams.psychologist = []
  }



  vm.noDeclaration = noDeclaration;
  vm.psychEval = psychEval;

  vm.givenDeclaration = givenDeclaration;

  vm.socialEval = socialEval;


  HeaderService.resetActions();
  HeaderService.setTitle($translate.instant('DECLARATION.ADVANCED_SEARCH'))

  function noDeclaration() {
    $scope.searchParams.closedWithoutDeclarationReason = '';
    $scope.searchParams.psychEval = false;
    $scope.searchParams.givenDeclaration = false;
    $scope.searchParams.socialEval = false;
  }

  function psychEval() {
    $scope.searchParams.psychologist = '';
    $scope.searchParams.noDeclaration = false;

  }

    function evalAll() {

          // $scope.searchParams.psychologist = '';
          $scope.searchParams.noDeclaration = false;

          // $scope.searchParams.doctor = '';
          // $scope.searchParams.supervisingDoctor = '';

          // $scope.searchParams.socialworker = '';

          $scope.searchParams.declarationFromDate = null;
          $scope.searchParams.declarationToDate = null;

          $scope.$broadcast('md-calendar-change', $scope.searchParams.declarationToDate);
          $scope.$broadcast('md-calendar-change', $scope.searchParams.declarationFromDate);

    }



  function givenDeclaration() {
    $scope.searchParams.doctor = '';
    $scope.searchParams.supervisingDoctor = '';
    $scope.searchParams.noDeclaration = false;
  }

  function socialEval() {
    // $scope.searchParams.socialworker = '';
    $scope.searchParams.noDeclaration = false;
  }

  function gotoCase(caseNumber) {
    $state.go('declaration.show', { caseid: caseNumber, searchquery : $scope.searchParams });
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
  }


  function toggleResults() {
    $scope.showResults = !$scope.showResults;
  }

  function clearResults() {
    vm.searchResults = [];
  }

  function advancedSearch(skip, max, query, preview) {
    clean(query);
    vm.isLoading = true;
    query.createdFromDate= $filter('date')(query.createdFromDate,'yyyy-MM-dd');
    query.createdToDate= $filter('date')(query.createdToDate,'yyyy-MM-dd');

    query.declarationFromDate= $filter('date')(query.declarationFromDate,'yyyy-MM-dd');
    query.declarationToDate= $filter('date')(query.declarationToDate,'yyyy-MM-dd');

    console.log("hvad er preview");
    console.log(preview);


    if (preview) {
      query.preview = "true";
    }

    DeclarationService.advancedSearch(skip, max, query)
      .then(response => {

        if (preview) {

          var printUrl = "/alfresco/s/api/node/content/workspace/SpacesStore/" + response.nodeRef;

          printJS(printUrl);
          query.preview = false;
          vm.printFriendlytStarted = false;
        }
        else {
          vm.isLoading = false;
          vm.totalResults = Number(response.total);
          vm.next = Number(response.next);

          angular.forEach(response.entries, entry => {
            vm.searchResults.push(entry);
          });

          console.log("hvad er query")
          console.log(query)
          console.log($scope)

          if (query.createdFromDate != undefined ) {
          console.log("jeg sætter noget...")
            vm.showSearch.h = query.createdFromDate;
          }



        }
      })
  }

  /**
   * https://material.angularjs.org/latest/demo/chips -> Custom Inputs
   * Return the proper object when the append is called.
   */
  function transformChip(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }

  function ChipHD(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }

  function ChipMD(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }

  function ChipSP(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }

  function ChipSTATUS(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }

  function ChipDOCTOR(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }

  function ChipSOCIAL(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }

  function ChipPSYC(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }

  function ChipSUPERVISOR(chip) {
    // just return the chip as we are simply dealing with a flat list of strings
    return chip;
  }


  function printFriendly() {
    vm.printFriendlytStarted = true;
    vm.advancedSearch(0,25, $scope.searchParams, true);
  }

  vm.printFriendly = printFriendly;

  function nextPage() {
    advancedSearch(vm.next, 25, $scope.searchParams, false)
  }

  function clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "" || obj[propName] === false) {
        delete obj[propName];
      }
    }
  }
}
