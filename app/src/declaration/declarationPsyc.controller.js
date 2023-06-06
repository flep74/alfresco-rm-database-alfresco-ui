'use strict';

angular
  .module('openDeskApp.declaration')
  .controller('DeclarationPsycController', PsycController);

function PsycController($scope, $mdDialog, $stateParams, DeclarationService, Toast, ContentService, HeaderService, $state, DeclarationPsycService, $templateCache) {
  var vm = this;
  vm.psycPropertyValues = undefined;
  vm.selectedInstrument = "";
  vm.selectedInstrumentName = "";

  vm.PROP_PSYC_LIBRARY_PSYCH_TYPE = "psykologisk_undersoegelsestype";

  vm.PROP_PSYC_LIBRARY_INTERVIEWRATING = "psykiatriske_interviews_og_ratingscales";
  vm.PROP_PSYC_LIBRARY_KOGNITIV = "kognitive_og_neuropsykologiske_praestationstests";
  vm.PROP_PSYC_LIBRARY_IMPLECITE = "implicitte_projektive_tests";
  vm.PROP_PSYC_LIBRARY_EXPLICIT = "eksplicitte_spoergeskema_tests";
  vm.PROP_PSYC_LIBRARY_MALERING = "instrumenter_for_indikation_på_malingering";
  vm.PROP_PSYC_LIBRARY_RISIKO = "risikovurderingsinstrumenter";

  vm.PROP_PSYC_LIBRARY_PSYCH_MALERING = "psykologisk_vurdering_af_forekomst_af_malingering";
  vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS = "konklusion_tags";

  vm.PsycInstruments = "";
  vm.selectedValues = [];

  vm.showText = [];

  vm.oneormorePsykologiskUnder = false;

  vm.oneormoreRisikoVurdering = false;
  vm.oneormoreIndiMalering = false;
  vm.oneormoreEksTest = false;
  vm.oneormoreImpTest = false;
  vm.oneormoreKognitive = false;
  vm.oneormorePsykInter = false;

  vm.oneormoreForeMalering = false;
  vm.oneormoreKonklusion = false;

  vm.conclusionText = "";


  // Mappings
  vm.titleMappings = {};

  $scope.myCountry = {
    selected:{}
  };

  vm.showSave = false;
  vm.disableTextArea = true;


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

  setupMappings();
  setupOverview();

  activate();


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

    DeclarationPsycService.saveDetailViewData($stateParams.caseid, vm.selectedInstrument, selectedIds).then(function (response) {
      $scope.myCountry = {
        selected:{}
      };

      // needed or else the template shows a glimse of the old template before drawing the new
      $templateCache.removeAll();
      $mdDialog.cancel();

      activate();

    });
  }

  vm.save = save;

  vm.clicked = clicked;

  function clicked(i) {

    // console.log("i");
    // console.log(i);
    //
    // console.log("vm.selectedValues");
    // console.log(vm.selectedValues);

  }




  function activate() {
    DeclarationPsycService.getOverViewData($stateParams.caseid).then(function (response) {

      // console.log("opslag for overbliksbillede: ");
      // console.log(response);

      vm.oneormorePsykologiskUnder = response[vm.PROP_PSYC_LIBRARY_PSYCH_TYPE];

      vm.oneormoreRisikoVurdering = response[vm.PROP_PSYC_LIBRARY_RISIKO];
      vm.oneormoreIndiMalering = response[vm.PROP_PSYC_LIBRARY_MALERING];
      vm.oneormoreEksTest = response[vm.PROP_PSYC_LIBRARY_EXPLICIT];
      vm.oneormoreImpTest = response[vm.PROP_PSYC_LIBRARY_IMPLECITE];
      vm.oneormoreKognitive = response[vm.PROP_PSYC_LIBRARY_KOGNITIV];
      vm.oneormorePsykInter = response[vm.PROP_PSYC_LIBRARY_INTERVIEWRATING];

      vm.oneormoreForeMalering = response[vm.PROP_PSYC_LIBRARY_PSYCH_MALERING];
      vm.oneormoreKonklusion = response[vm.PROP_PSYC_LIBRARY_KONKLUSION_TAGS];

      // console.log("vm.oneormorePsykologiskUnder")
      // console.log(vm.oneormorePsykologiskUnder);

    });


    DeclarationPsycService.getKonklusionText($stateParams.caseid).then(function (response) {
      console.log("hej fra getKonklusionText")
      console.log(response);

      vm.conclusionText = response.data;

    });

  }






  // setup initial data
  DeclarationPsycService.test2().then(function (response) {
    vm.psycPropertyValues = response;
  });



  function getInstrumentByName(name) {
    var found = false;
    var i = 0;

    while (!found && i<=vm.psycPropertyValues.result.length-1) {
      let instrumentName = vm.psycPropertyValues.result[i].instrumentname;

      if (name == instrumentName) {
        return vm.psycPropertyValues.result[i].values;
      }
      i++;
    }
  }

  vm.getInstrumentByName = getInstrumentByName;


  // need to be rewritten - each category needs to be checked if at least one checkbox has been selected. Then it should be marked - perhaps
  // with a bold font.

  function setupOverview() {

   // lav kald til backend og hent true:false for om en kategori skal skrives med fed

    DeclarationPsycService.getOverViewData("26").then(function (response) {
      console.log("response")
      console.log(response);
    });
  }

  function viewButton(instrument) {
      // console.log("hvad er items");


    $scope.myCountry = {
      selected:{}
    };

    vm.selectedInstrument = instrument;
    vm.selectedInstrumentName = vm.titleMappings[instrument];

    DeclarationPsycService.getDetailViewData($stateParams.caseid, instrument).then(function (response) {
      vm.items = response.data;

      if (vm.items != undefined) {
        for (let i=0; i<= vm.items.length-1;i++) {
          // console.log(vm.items[i]);
          $scope.myCountry.selected[vm.items[i].id] = vm.items[i].val
        }
      }
    });

      $mdDialog.show({
        templateUrl: 'app/src/declaration/view/psyc/sections/popup.html',
        scope: $scope, // use parent scope in template
        preserveScope: true, // do not forget this if use parent scope
        clickOutsideToClose: false
      });
  }

  function viewButtonUndersoegelsestype(instrument) {

      $scope.myCountry = {
        selected:{}
      };

      vm.selectedInstrument = instrument;
      vm.selectedInstrumentName = vm.titleMappings[instrument];

      DeclarationPsycService.getDetailViewData($stateParams.caseid, instrument).then(function (response) {
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
        preserveScope: true, // do not forget this if use parent scope
        clickOutsideToClose: false
      });
    }

function viewButtonAnvendteInterviewsRatingScale(instrument) {

      $scope.myCountry = {
        selected:{}
      };

      vm.selectedInstrument = instrument;
      vm.selectedInstrumentName = vm.titleMappings[instrument];

      DeclarationPsycService.getDetailViewData($stateParams.caseid, instrument).then(function (response) {
        vm.items = response.data;
        let numberOfItems = vm.items.length;

        vm.showText = new Array();
        // setup order as requested by retspsyk pdf

        vm.showText[0] = getItemWithID(8, vm.items); // "name": "PSE-10",
        vm.showText[1] = getItemWithID(18, vm.items); // "name": "SCID-5-PD",
        vm.showText[2] = getItemWithID(26, vm.items); // "name": "ABAS-3",
        vm.showText[3] = getItemWithID(9, vm.items); // "name": "EASE",
        vm.showText[4] = getItemWithID(19, vm.items); // "name": "OPD-2",
        vm.showText[5] = getItemWithID(27, vm.items);  // "name": "Vineland-3",
        vm.showText[6] = getItemWithID(10, vm.items); // "name": "PANSS",
        vm.showText[7] = getItemWithID(20, vm.items); // "name": "PCL-R",
        vm.showText[8] = getItemWithID(29, vm.items); // "name": "ADOS 1 og 2",
        vm.showText[9] = getItemWithID(11, vm.items); // "name": "ASI",
        vm.showText[10] = getItemWithID(21, vm.items); // "name": "PCL:SV",
        vm.showText[11] = getItemWithID(9, vm.items); // "name": "ADI-R",
        vm.showText[12] = getItemWithID(9, vm.items); // "name": "HCL-32",
        vm.showText[13] = getItemWithID(9, vm.items); // "name": "CAPP",
        vm.showText[14] = getItemWithID(9, vm.items); // "name": "DIVA 1,2 og 5",
        vm.showText[15] = getItemWithID(9, vm.items); // "name": "BDI-II",
        vm.showText[16] = getItemWithID(9, vm.items); // "name": "ZAN-BPD",
        vm.showText[17] = getItemWithID(9, vm.items); // "name": "AAI",
        vm.showText[18] = getItemWithID(9, vm.items); // "name": "SCID-V",
        vm.showText[19] = getItemWithID(9, vm.items); // "name": "Hansson SAQ",
        vm.showText[20] = getItemWithID(9, vm.items); // "name": "SASB",
        vm.showText[21] = getItemWithID(9, vm.items); // "name": "ADIS-V",
        vm.showText[22] = getItemWithID(9, vm.items); // "name": "Hostility TWQ",
        vm.showText[23] = getItemWithID(9, vm.items); // "name": "PCL:YV",
        vm.showText[24] = getItemWithID(9, vm.items); // "name": "Y-BOCS",
        vm.showText[25] = getItemWithID(9, vm.items); // "name": "HADS",
      });

      $mdDialog.show({
        templateUrl: 'app/src/declaration/view/psyc/sections/popupAnvendteInterviewRatingScale.html',
        scope: $scope, // use parent scope in template
        preserveScope: true, // do not forget this if use parent scope
        clickOutsideToClose: false
      });
    }

  vm.viewButtonAnvendteInterviewsRatingScale = viewButtonAnvendteInterviewsRatingScale;

  function showTextClicked(item) {
    vm.showText[item].val = !vm.showText[item].val;
  }

  vm.showTextClicked = showTextClicked;


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


  function viewButton2(instrument) {
    // console.log("hvad er items");


    $scope.myCountry = {
      selected:{}
    };

    vm.selectedInstrument = instrument;
    vm.selectedInstrumentName = vm.titleMappings[instrument];

    DeclarationPsycService.getDetailViewData($stateParams.caseid, instrument).then(function (response) {
      vm.items = response.data;
      let numberOfItems = vm.items.length;

      console.log("vm.items: ");
      console.log(vm.items);

      console.log("vm.items.length: ");
      console.log(vm.items.length);

      let tmp = numberOfItems / 3;
      console.log("hvad er tmp + " + tmp)

      let itemsInEachColumn = Math.ceil(tmp);
      console.log("items in each column" + itemsInEachColumn);

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

        console.log("hvad er columnTwoLength");
        console.log(vm.columnTwoLength);

        console.log("vm.items.length-1");
        console.log(vm.items.length-1);



        for (let i=vm.columnTwoLength; i<= vm.items.length-1;i++) {
          console.log("number of times called, count me: ");
          vm.itemsColumnTree.push(vm.items[i]);
        }
      }


      console.log("antal:");
      console.log(vm.items.length)

      console.log("itemsInEachColumn:");
      console.log(itemsInEachColumn)

      if (vm.items != undefined) {
        for (let i=0; i<= vm.items.length-1;i++) {
          // console.log(vm.items[i]);
          $scope.myCountry.selected[vm.items[i].id] = vm.items[i].val
        }
      }
    });

    $mdDialog.show({
      templateUrl: 'app/src/declaration/view/psyc/sections/popup2.html',
      scope: $scope, // use parent scope in template
      preserveScope: true, // do not forget this if use parent scope
      clickOutsideToClose: false
    });
  }

  vm.viewButton2 = viewButton2;
  vm.viewButton = viewButton;
  vm.viewButtonUndersoegelsestype = viewButtonUndersoegelsestype;

  function cancelDialog() {
    $scope.myCountry = {
      selected:{}
    };

    // needed or else the template shows a glimse of the old template before drawing the new
    $templateCache.removeAll();
    $mdDialog.cancel();
  }
  vm.cancelDialog = cancelDialog;

  function saveConclusionText() {
    DeclarationPsycService.saveKonklusionText($stateParams.caseid, vm.conclusionText).then( function (response) {
      vm.showSave = false;
      vm.disableTextArea = true;

      Toast.show('Teksten er gemt');
    } )
  }

  vm.saveConclusionText = saveConclusionText;


}
