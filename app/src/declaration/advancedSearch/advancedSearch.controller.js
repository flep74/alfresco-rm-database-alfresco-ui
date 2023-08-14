'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('AdvancedSearchController', AdvancedSearchController);

function AdvancedSearchController($scope, $state, $templateCache, $mdDialog, $translate, DeclarationService, filterService, propertyService, HeaderService, $filter, $stateParams, DeclarationPsycService, authService) {

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

  vm.searchPop = function() {

    vm.pop3 = $mdDialog.show({
        templateUrl: 'app/src/declaration/view/psyc/sections/popupSearch3.html',
        scope: $scope, // use parent scope in template
        multiple: true,
        preserveScope: true, // do not forget this if use parent scope
        clickOutsideToClose: false
      });

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

  vm.selectInstruments = function(inst) {
    console.log("valgt");
    console.log(inst)
  }

  vm.pop2 = function() {

          console.log("hvad er der valgt:")
          console.log($scope.searchParams.psyktests);

          if ($scope.searchParams.psyktests == vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS) {

            viewButtonKonklusion(vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS);

          }


    };

  function viewButtonKonklusion(instrument) {

        $scope.myCountry.konklusion = {
          selected:{}
        };

        vm.selectedInstrument = instrument;
        vm.selectedInstrumentName = vm.titleMappings[instrument];

        DeclarationPsycService.getAdvancedSearchInstrument(instrument).then(function (response) {

                console.log("havd er response")
            console.log(response);

            vm.items = response.data;


          let numberOfItems = vm.items.length;

          vm.showText = new Array();
          // setup order as requested by retspsyk pdf

          vm.showText[0] = getItemWithID(159, vm.items); // "name": "SIRS og SIRS-2",
          vm.showText[1] = getItemWithID(160, vm.items); // "name": "RFI",
          vm.showText[2] = getItemWithID(161, vm.items); // "name": "SIMS",

          vm.showText[3] = getItemWithID(162, vm.items); // "name": "MMPI-2 / MMPI-2 RF",
          vm.showText[4] = getItemWithID(163, vm.items); // "name": "TOMM",
          vm.showText[5] = getItemWithID(164, vm.items);  // "name": "M_FAST",

          vm.showText[6] = getItemWithID(165, vm.items); // "name": "PAI",
          vm.showText[7] = getItemWithID(166, vm.items); // "name": "RMT-W og RMT-F",
          vm.showText[8] = getItemWithID(167, vm.items); // "name": "MENT",

          vm.showText[9] = getItemWithID(168, vm.items); // "name": "MCMI-III / MCMI-IV",
          vm.showText[10] = getItemWithID(169, vm.items); // "name": "VSVT",
          vm.showText[11] = getItemWithID(170, vm.items); // "name": "ADI",

          vm.showText[12] = getItemWithID(171, vm.items); // "name": "MENT",
          vm.showText[13] = getItemWithID(172, vm.items); // "name": "MCMI-III / MCMI-IV",
          vm.showText[14] = getItemWithID(173, vm.items); // "name": "VSVT",

          vm.showText[15] = getItemWithID(174, vm.items); // "name": "ADI",
          vm.showText[16] = getItemWithID(175, vm.items); // "name": "MENT",
          vm.showText[17] = getItemWithID(176, vm.items); // "name": "MCMI-III / MCMI-IV",

          vm.showText[18] = getItemWithID(177, vm.items); // "name": "VSVT",
          vm.showText[19] = getItemWithID(178, vm.items); // "name": "ADI",
          vm.showText[20] = getItemWithID(179, vm.items); // "name": "ADI",

          vm.showText[21] = getItemWithID(180, vm.items); // "name": "ADI",
          vm.showText[22] = getItemWithID(181, vm.items); // "name": "ADI",
          vm.showText[23] = getItemWithID(182, vm.items); // "name": "ADI",

          vm.showText[24] = getItemWithID(183, vm.items); // "name": "ADI",
          vm.showText[25] = getItemWithID(184, vm.items); // "name": "ADI",
          vm.showText[26] = getItemWithID(185, vm.items); // "name": "MENT",

          vm.showText[27] = getItemWithID(186, vm.items); // "name": "MCMI-III / MCMI-IV",
          vm.showText[28] = getItemWithID(187, vm.items); // "name": "VSVT",
          vm.showText[29] = getItemWithID(188, vm.items); // "name": "ADI",

        });

        $mdDialog.show({
          templateUrl: 'app/src/declaration/view/psyc/sections/popupKonklusion.html',
          scope: $scope, // use parent scope in template
          preserveScope: true, // do not forget this if use parent scope
          clickOutsideToClose: false
        });
  }
  vm.viewButtonKonklusion = viewButtonKonklusion;


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

          // add login token to url
          var printUrl = "/alfresco/s/api/node/content/workspace/SpacesStore/" + response.nodeRef + "?alf_ticket=" + authService.getUserInfo().ticket;

          console.log("printUrl")
          console.log(printUrl)
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
            vm.showCriteria = vm.showCriteria + " afsluttet" + ", "
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
                vm.showCriteria = vm.showCriteria + "erklæringsperiode: " + query.declarationFromDate + " - " + query.declarationToDate + ", "
            }
            else if (query.declarationFromDate != undefined && query.declarationToDate == undefined) {
                 vm.showCriteria = vm.showCriteria + "erklæringsperiode: " + query.declarationFromDate + " - " + ", "
            }
            else if (query.declarationFromDate == undefined && query.declarationToDate != undefined) {
                 vm.showCriteria = vm.showCriteria + "erklæringsperiode: - " + query.declarationToDate + ", "
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

        if (query.cpr != undefined) {
            vm.showCriteria = vm.showCriteria + query.cpr + ", "
        }


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

    function getItemWithID(id, itemList) {
      var found = false;
      var i = 0;

      while (!found && i <= itemList.length-1) {
          if (itemList[i].id == id) {
              console.log("me found you");
              console.log(itemList[i]);
              return itemList[i];
              found = true;
          }
          else {
              i = i +1;
          }
      }
    }

function save() {

    let val = $scope.myCountry.selected;

    let selectedIds = "";

    for (var i =0; i<=vm.showText.length-1;i++) {
        var instrument = vm.showText[i];
        if (instrument.val) {
            if (selectedIds == "") {
                  selectedIds = instrument.id;
            }
            else {
              selectedIds = selectedIds + "," + instrument.id;
            }
        }
    }

    console.log("hvad er selectedIds:")
    console.log(selectedIds)
    console.log(selectedIds)
    console.log(selectedIds)

//    DeclarationPsycService.saveDetailViewData($stateParams.caseid, vm.selectedInstrument, selectedIds).then(function (response) {
//      $scope.myCountry = {
//        selected:{}
//      };
//
//      // needed or else the template shows a glimse of the old template before drawing the new
//      $templateCache.removeAll();
//      $mdDialog.cancel();
//
//      activate();
//
//    });
  }

  vm.save = save;

  function cancelDialog() {
      $scope.myCountry = {
        selected:{}
      };

      // needed or else the template shows a glimse of the old template before drawing the new
      $templateCache.removeAll();
      $mdDialog.cancel();
    }
    vm.cancelDialog = cancelDialog;

    function showTextClicked(item) {
        vm.showText[item].val = !vm.showText[item].val;
      }

      vm.showTextClicked = showTextClicked;

  function clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "" || obj[propName] === false) {
        delete obj[propName];
      }
    }
  }


  function viewButtonUndersoegelsestype(instrument) {

        console.log("vm.selectedUndersoegelsetype")
        console.log(vm.selectedUndersoegelsetype);

        $scope.myCountry = {
          selected:{}
        };

        vm.selectedInstrument = instrument;
        vm.selectedInstrumentName = vm.titleMappings[instrument];



        if (vm.selectedUndersoegelsetype.length != 0) {

           vm.items = vm.selectedUndersoegelsetype;
          let numberOfItems = vm.items.length;

          vm.showText = new Array();
          // setup order as requested by retspsyk pdf

          vm.showText[0] = getItemWithID(1, vm.items);
          vm.showText[1] = getItemWithID(2, vm.items);
          vm.showText[2] = getItemWithID(3, vm.items);
          vm.showText[3] = getItemWithID(4, vm.items);
          vm.showText[4] = getItemWithID(5, vm.items);
          vm.showText[5] = getItemWithID(6, vm.items);
          vm.showText[6] = getItemWithID(7, vm.items);


        $mdDialog.show({
          templateUrl: 'app/src/declaration/view/psyc/sections/popupUndersoegelsestype.html',
          scope: $scope, // use parent scope in template
           multiple: true,
          preserveScope: true, // do not forget this if use parent scope
          clickOutsideToClose: false
        });



        }
        else {

            DeclarationPsycService.getAdvancedSearchInstrument(instrument).then(function (response) {
                vm.items = response.data;
              let numberOfItems = vm.items.length;

              vm.showText = new Array();
              // setup order as requested by retspsyk pdf

              vm.showText[0] = getItemWithID(1, vm.items);
              vm.showText[1] = getItemWithID(2, vm.items);
              vm.showText[2] = getItemWithID(3, vm.items);
              vm.showText[3] = getItemWithID(4, vm.items);
              vm.showText[4] = getItemWithID(5, vm.items);
              vm.showText[5] = getItemWithID(6, vm.items);
              vm.showText[6] = getItemWithID(7, vm.items);
            });

            $mdDialog.show({
              templateUrl: 'app/src/declaration/view/psyc/sections/popupUndersoegelsestype.html',
              scope: $scope, // use parent scope in template
               multiple: true,
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: false
            }).onClose.subscribe(confirm => {
                      if(confirm) {
                          console.log(confirm);
                          this.record();
                      }
                  });

          }
      }

      vm.viewButtonUndersoegelsestype = viewButtonUndersoegelsestype;

      vm.selectedUndersoegelsetype = [];


    function viewButtonAnvendteInterviewsRatingScale(instrument) {

        console.log("vm.selectedUndersoegelsetype")
        console.log(vm.selectedUndersoegelsetype);

        $scope.myCountry = {
          selected:{}
        };

        vm.selectedInstrument = instrument;
        vm.selectedInstrumentName = vm.titleMappings[instrument];



        if (vm.selectedPsykiatriskeInterviewRatingScales.length != 0) {

            vm.items = vm.selectedPsykiatriskeInterviewRatingScales;
            let numberOfItems = vm.items.length;

            vm.showText = new Array();

            // setup order as requested by retspsyk pdf

             vm.showText[0] = getItemWithID(8, vm.items); // "name": "PSE-10",
             vm.showText[1] = getItemWithID(18, vm.items); // "name": "SCID-5-PD",
             vm.showText[2] = getItemWithID(27, vm.items); // "name": "ABAS-3",
             vm.showText[3] = getItemWithID(9, vm.items); // "name": "EASE",
             vm.showText[4] = getItemWithID(19, vm.items); // "name": "OPD-2",
             vm.showText[5] = getItemWithID(28, vm.items);  // "name": "Vineland-3",
             vm.showText[6] = getItemWithID(10, vm.items); // "name": "PANSS",
             vm.showText[7] = getItemWithID(20, vm.items); // "name": "PCL-R",
             vm.showText[8] = getItemWithID(29, vm.items); // "name": "ADOS 1 og 2",
             vm.showText[9] = getItemWithID(11, vm.items); // "name": "ASI",
             vm.showText[10] = getItemWithID(21, vm.items); // "name": "PCL:SV",
             vm.showText[11] = getItemWithID(30, vm.items); // "name": "ADI-R",
             vm.showText[12] = getItemWithID(12, vm.items); // "name": "HCL:32",
             vm.showText[13] = getItemWithID(22, vm.items); // "name": "CAPP",
             vm.showText[14] = getItemWithID(31, vm.items); // "name": "DIVA 1,2 og 5",
             vm.showText[15] = getItemWithID(13, vm.items); // "name": "BDI-II",
             vm.showText[16] = getItemWithID(23, vm.items); // "name": "ZANBPD",
             vm.showText[17] = getItemWithID(32, vm.items); // "name": "AAI",
             vm.showText[18] = getItemWithID(14, vm.items); // "name": "SCID-V",
             vm.showText[19] = getItemWithID(24, vm.items); // "name": "Hansson SAQ",
             vm.showText[20] = getItemWithID(33, vm.items); // "name": "SASB",
             vm.showText[21] = getItemWithID(15, vm.items); // "name": "ADIS-V",
             vm.showText[22] = getItemWithID(25, vm.items); // "name": "Hostility TWQ",
             vm.showText[23] = getItemWithID(34, vm.items); // "name": "PCL:YV",
             vm.showText[24] = getItemWithID(16, vm.items); // "name": "Y-BOCS",
             vm.showText[25] = getItemWithID(26, vm.items); // "name": "HADS",
             vm.showText[26] = getItemWithID(17, vm.items); // "name": "HTQ",


            $mdDialog.show({
              templateUrl: 'app/src/declaration/view/psyc/sections/popupAnvendteInterviewRatingScale.html',
              scope: $scope, // use parent scope in template
               multiple: true,
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: false
            });
        }
        else {

            DeclarationPsycService.getAdvancedSearchInstrument(instrument).then(function (response) {
                vm.items = response.data;
              let numberOfItems = vm.items.length;

              vm.showText = new Array();
              // setup order as requested by retspsyk pdf

             vm.showText[0] = getItemWithID(8, vm.items); // "name": "PSE-10",
             vm.showText[1] = getItemWithID(18, vm.items); // "name": "SCID-5-PD",
             vm.showText[2] = getItemWithID(27, vm.items); // "name": "ABAS-3",
             vm.showText[3] = getItemWithID(9, vm.items); // "name": "EASE",
             vm.showText[4] = getItemWithID(19, vm.items); // "name": "OPD-2",
             vm.showText[5] = getItemWithID(28, vm.items);  // "name": "Vineland-3",
             vm.showText[6] = getItemWithID(10, vm.items); // "name": "PANSS",
             vm.showText[7] = getItemWithID(20, vm.items); // "name": "PCL-R",
             vm.showText[8] = getItemWithID(29, vm.items); // "name": "ADOS 1 og 2",
             vm.showText[9] = getItemWithID(11, vm.items); // "name": "ASI",
             vm.showText[10] = getItemWithID(21, vm.items); // "name": "PCL:SV",
             vm.showText[11] = getItemWithID(30, vm.items); // "name": "ADI-R",
             vm.showText[12] = getItemWithID(12, vm.items); // "name": "HCL:32",
             vm.showText[13] = getItemWithID(22, vm.items); // "name": "CAPP",
             vm.showText[14] = getItemWithID(31, vm.items); // "name": "DIVA 1,2 og 5",
             vm.showText[15] = getItemWithID(13, vm.items); // "name": "BDI-II",
             vm.showText[16] = getItemWithID(23, vm.items); // "name": "ZANBPD",
             vm.showText[17] = getItemWithID(32, vm.items); // "name": "AAI",
             vm.showText[18] = getItemWithID(14, vm.items); // "name": "SCID-V",
             vm.showText[19] = getItemWithID(24, vm.items); // "name": "Hansson SAQ",
             vm.showText[20] = getItemWithID(33, vm.items); // "name": "SASB",
             vm.showText[21] = getItemWithID(15, vm.items); // "name": "ADIS-V",
             vm.showText[22] = getItemWithID(25, vm.items); // "name": "Hostility TWQ",
             vm.showText[23] = getItemWithID(34, vm.items); // "name": "PCL:YV",
             vm.showText[24] = getItemWithID(16, vm.items); // "name": "Y-BOCS",
             vm.showText[25] = getItemWithID(26, vm.items); // "name": "HADS",
             vm.showText[26] = getItemWithID(17, vm.items); // "name": "HTQ",
            });

            $mdDialog.show({
              templateUrl: 'app/src/declaration/view/psyc/sections/popupAnvendteInterviewRatingScale.html',
              scope: $scope, // use parent scope in template
               multiple: true,
              preserveScope: true, // do not forget this if use parent scope
              clickOutsideToClose: false
            }).onClose.subscribe(confirm => {
                      if(confirm) {
                          console.log(confirm);
                          this.record();
                      }
                  });

          }
      }

      vm.viewButtonAnvendteInterviewsRatingScale = viewButtonAnvendteInterviewsRatingScale;

      vm.selectedPsykiatriskeInterviewRatingScales = [];


      function save(inp, instrument) {
        console.log("tilbage fra vælg");
        console.log("inp");
        console.log(inp);
        console.log("hvad er instrument");
        console.log(instrument);
        console.log("hvad er instrument");

        switch(instrument) {
          case 'psykologisk_undersoegelsestype':
            // code block
            console.log("hejk");
            vm.selectedUndersoegelsetype = inp;
            break;
          case 'psykiatriske_interviews_og_ratingscales':
            // code block
            vm.selectedPsykiatriskeInterviewRatingScales = inp;
            break;
          case 'kognitive_og_neuropsykologiske_praestationstests':
            vm.selectedPsykiatriskeInterviewRatingScales = inp;
             break;
          default:
            // code block
        }


        $mdDialog.cancel();

      }

      vm.save = save;





}
