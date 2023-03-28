'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('AdvancedSearchController', AdvancedSearchController);

function AdvancedSearchController($scope, $state, $templateCache, $mdDialog, $translate, DeclarationService, filterService, propertyService, HeaderService, $filter, $stateParams, DeclarationPsycService) {

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

  vm.showCriteria = "";

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

  vm.PROP_PSYC_LIBRARY_PSYCH_TYPE = "psykologisk_undersoegelsestype";

  vm.PROP_PSYC_LIBRARY_INTERVIEWRATING = "psykiatriske_interviews_og_ratingscales";
  vm.PROP_PSYC_LIBRARY_KOGNITIV = "kognitive_og_neuropsykologiske_praestationstests";
  vm.PROP_PSYC_LIBRARY_IMPLECITE = "implicitte_projektive_tests";
  vm.PROP_PSYC_LIBRARY_EXPLICIT = "eksplicitte_spoergeskema_tests";
  vm.PROP_PSYC_LIBRARY_MALERING = "instrumenter_for_indikation_på_malingering";
  vm.PROP_PSYC_LIBRARY_RISIKO = "risikovurderingsinstrumenter";

  vm.PROP_PSYC_LIBRARY_PSYCH_MALERING = "psykologisk_vurdering_af_forekomst_af_malingering";
  vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS = "konklusion_tags";


  $scope.myCountry = {
    selected:{}
  };

  // Mappings
  vm.titleMappings = {};

  vm.searchInstrumentsQuery = {};

  function setupMappings() {
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_PSYCH_TYPE] = "Psykologisk undersøgelsestype";

    vm.titleMappings[vm.PROP_PSYC_LIBRARY_INTERVIEWRATING] = "Psykiatriske interviews og ratingscales";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_KOGNITIV] = "Kognitive og neuropsykologiske præstationstests";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_IMPLECITE] = "Implicitte (projektive) tests";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_EXPLICIT] = "Eksplicitte (spørgeskema) tests";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_MALERING] = "Instrumenter for indikation på malingering";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_RISIKO] = "Risikovurderingsinstrumenter";

    vm.titleMappings[vm.PROP_PSYC_LIBRARY_PSYCH_MALERING] = "Psykologisk vurdering af forekomst af malingering";
    vm.titleMappings[vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS] = "Standard formuleringer";
  }

  $scope.myInstrument = {
    selected:{}
  };

  setupMappings();

  $scope.searchParams.bua = "PS";
  $scope.searchParams.closed = "CLOSED";
  $scope.searchParams.koen = "alle";

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


  vm.pop = function(){

    viewInstrument($scope.searchParams.psyktests);

    // if ($scope.searchParams.psyktests==1){
    //   viewInstrument(vm.PROP_PSYC_LIBRARY_PSYCH_TYPE);
    // }

  };

  function close() {
    // needed or else the template shows a glimse of the old template before drawing the new
    $templateCache.removeAll();
    $mdDialog.cancel();


    // todo check if anything selected and add - dont add a {} empty

    console.log("hvad er $scope.myInstrument.selected");
    console.log($scope.myInstrument.selected);

    vm.searchInstrumentsQuery[vm.selectedInstrument] = $scope.myInstrument.selected;

    console.log("hvad er der i searchInstrumentQuery")
    console.log(vm.searchInstrumentsQuery);

    $scope.myInstrument.selected = {};

  }
  vm.close = close;

  function viewInstrument(instrument) {
    vm.selectedInstrument = instrument;
    vm.selectedInstrumentName = vm.titleMappings[instrument];

    // check if instruments have been selected

    console.log("hvad er der i vm.searchInstrumentsQuery[instrument]");
    console.log(vm.searchInstrumentsQuery[instrument]);

    // check if this is the first time the instrument is choosen
    if (vm.searchInstrumentsQuery[instrument] != undefined) {
      $scope.myInstrument.selected = vm.searchInstrumentsQuery[instrument];

      DeclarationPsycService.getAdvancedSearchInstrument(instrument).then(function (response) {

        console.log("havd er response")
        console.log(response);

        vm.items = response.data;

        // add logic for correct column sorting

        let numberOfItems = vm.items.length;

        console.log("vm.items: ");
        console.log(vm.items);

        console.log("vm.items.length: ");
        console.log(vm.items.length);

        let tmp = numberOfItems / 3;
        console.log("hvad er tmp + ")

        let itemsInEachColumn = Math.ceil(tmp);

        vm.columnOneLength = itemsInEachColumn;
        vm.columnTwoLength = itemsInEachColumn + vm.columnOneLength;
        vm.columnThreeLength = itemsInEachColumn;

        console.log("vm.columnOneLength");
        console.log(vm.columnOneLength);
        console.log("vm.columnTowoLength");
        console.log(vm.columnTwoLength);
        console.log("vm.columnThreeLength");
        console.log(vm.columnThreeLength);


        vm.itemsColumnOne = new Array();
        vm.itemsColumnTwo = new Array()
        vm.itemsColumnTree = new Array();

        // setup each column
        if (vm.items != undefined) {

          for (let i=0; i<= vm.columnOneLength-1;i++) {
            vm.itemsColumnOne.push(vm.items[i]);
          }

          for (let i=vm.columnOneLength; i<= vm.columnTwoLength-1;i++) {
            vm.itemsColumnTwo.push(vm.items[i]);
          }

          for (let i=vm.columnTwoLength; i<= vm.items.length-1;i++) {
            vm.itemsColumnTree.push(vm.items[i]);
          }
        }


        console.log("antal:");
        console.log(vm.items.length)

        console.log("itemsInEachColumn:");
        console.log(itemsInEachColumn)

        // end column sorting logic

      });

    }
    else {
      DeclarationPsycService.getAdvancedSearchInstrument(instrument).then(function (response) {
        vm.items = response.data;

        console.log("havd er response i else")
        console.log(response);

        if (vm.items != undefined) {
          for (let i=0; i<= vm.items.length-1;i++) {
            $scope.myInstrument.selected[vm.items[i].id] = vm.items[i].val
          }
        }

        // add logic for correct column sorting

        let numberOfItems = vm.items.length;

        let tmp = numberOfItems / 3;
        let itemsInEachColumn = Math.ceil(tmp);

        vm.columnOneLength = itemsInEachColumn;
        vm.columnTwoLength = itemsInEachColumn + vm.columnOneLength;
        vm.columnThreeLength = itemsInEachColumn;

        vm.itemsColumnOne = new Array();
        vm.itemsColumnTwo = new Array()
        vm.itemsColumnTree = new Array();

        // setup each column
        if (vm.items != undefined) {

          for (let i=0; i<= vm.columnOneLength-1;i++) {
            vm.itemsColumnOne.push(vm.items[i]);
          }

          for (let i=vm.columnOneLength; i<= vm.columnTwoLength-1;i++) {
            vm.itemsColumnTwo.push(vm.items[i]);
          }

          for (let i=vm.columnTwoLength; i<= vm.items.length-1;i++) {
            vm.itemsColumnTree.push(vm.items[i]);
          }
        }

        // end column sorting logic


      });





    }



    $mdDialog.show({
      templateUrl: 'app/src/declaration/view/psyc/sections/popupSearch.html',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: false
    });
  }


  vm.otherFunction = function(){
    alert("in the other function");
  };



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

    console.log("hvad er query?");
    console.log(query);

    clean(query);
    vm.isLoading = true;
    query.createdFromDate= $filter('date')(query.createdFromDate,'yyyy-MM-dd');
    query.createdToDate= $filter('date')(query.createdToDate,'yyyy-MM-dd');

    query.declarationFromDate= $filter('date')(query.declarationFromDate,'yyyy-MM-dd');
    query.declarationToDate= $filter('date')(query.declarationToDate,'yyyy-MM-dd');

    if (preview) {
      query.preview = "true";
    }

    query.instruments = vm.searchInstrumentsQuery;

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

          // setup the display of criteries

          vm.showCriteria = "";

          if (query.createdFromDate != undefined && query.createdToDate != undefined) {
            vm.showCriteria = vm.showCriteria + "periode=" + query.createdFromDate + " - " + query.createdToDate + ", "
          }
          else if ( (query.createdFromDate != undefined) && (query.createdToDate == undefined)) {
            vm.showCriteria = vm.showCriteria + "periode=" + query.createdFromDate + " - " + ", "
          }
          else if (query.createdFromDate == undefined && query.createdToDate != undefined) {
            vm.showCriteria = vm.showCriteria + "periode=" + " - " + query.createdToDate + ", "
          }

          if (query.bua != undefined) {
            vm.showCriteria = vm.showCriteria + query.bua + ", "
          }

          if (query.closed == undefined) {
            vm.showCriteria = vm.showCriteria + " alle" + ", "
            }
          else if (query.closed == "CLOSED") {
            vm.showCriteria = vm.showCriteria + " lukket" + ", "
          }
          else  {
            vm.showCriteria = vm.showCriteria + " åben" + ", "
          }

          if (query.mainCharge.length > 0) {
            vm.showCriteria = vm.showCriteria + query.mainCharge + ", "
          }

          if (query.mainDiagnosis.length > 0) {
            vm.showCriteria = vm.showCriteria + "hoveddiagnose=" + query.mainDiagnosis + ", "
          }

        if (query.placement.length > 0) {
            vm.showCriteria = vm.showCriteria + query.placement + ", "
        }

        if (query.sanctionProposal.length > 0) {
            vm.showCriteria = vm.showCriteria + "sanktionsforslag=" + query.sanctionProposal + ", "
        }


        if (query.waitingTime != undefined) {
            var ventetid = "";
            if (query.waitingTime.time == "total") {
                ventetid = "samlet ventetid "
            }
            else if (query.waitingTime.time == "active") {
                ventetid = "aktiv ventetid "
            }
            else if (query.waitingTime.time == "passive") {
                ventetid = "passiv ventetid "
            }

            var modifier = "";
            if (query.waitingTime.modifier == "equal") {
                modifier = "lig med "
            }
            else if (query.waitingTime.modifier == "over") {
                modifier = "over "
            }
            else if (query.waitingTime.modifier == "under") {
                modifier = "under "
            }
            var output = ventetid  + modifier + query.waitingTime.days + " dage";
            vm.showCriteria = vm.showCriteria + output + ", "
        }

        if (query.status.length > 0) {
            vm.showCriteria = vm.showCriteria + query.status + ", "
        }

        if (query.evalAll) {
            vm.showCriteria = vm.showCriteria + "erklæring afgivet af= ";

            if (query.psychologist.length > 0) {
                vm.showCriteria = vm.showCriteria + "psykolog " + query.psychologist + ", "
            }

            if (query.doctor.length > 0) {
                vm.showCriteria = vm.showCriteria + "læge " + query.doctor + ", "
            }

            if (query.supervisingDoctor.length > 0) {
                vm.showCriteria = vm.showCriteria + "tiltrædes af læge  " + query.supervisingDoctor + ", "
            }

            if (query.socialworker.length > 0) {
                vm.showCriteria = vm.showCriteria + "socialrådgiver  " + query.socialworker + ", "
            }

            if (query.declarationFromDate != undefined && query.declarationToDate != undefined) {
                vm.showCriteria = vm.showCriteria + query.declarationFromDate + " - " + query.declarationToDate + ", "
            }
            else if (query.declarationFromDate != undefined && query.declarationToDate == undefined) {
                 vm.showCriteria = vm.showCriteria + query.declarationFromDate + " - " + ", "
            }
            else if (query.declarationFromDate == undefined && query.declarationToDate != undefined) {
                 vm.showCriteria = vm.showCriteria + query.declarationToDate + ", "
            }
        }

        if (query.noDeclaration) {
            vm.showCriteria = vm.showCriteria + "afsluttet uden erklæring " + ", "

            if (query.closedWithoutDeclarationReason != undefined) {
                vm.showCriteria = vm.showCriteria + query.closedWithoutDeclarationReason + ", "
            }
        }

        if (query.koen == "alle") {
            vm.showCriteria = vm.showCriteria + "begge køn" + ", "
        }
        else if (query.koen == "M") {
             vm.showCriteria = vm.showCriteria + "mand " + ", "
        }
        else if (query.koen == "K") {
             vm.showCriteria = vm.showCriteria + "kvinde " + ", "
        }

        if (query.firstName != undefined) {
            vm.showCriteria = vm.showCriteria + query.firstName + ", "
        }

        if (query.koen != "cpr") {
            vm.showCriteria = vm.showCriteria + query.cpr + ", "
        }

          console.log("her kommer søge kriterierne: ");
          console.log(query);




          angular.forEach(response.entries, entry => {
            vm.searchResults.push(entry);

          });
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
