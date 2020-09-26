'use strict';

angular
  .module('oda.flowchart')
  .controller('FlowChartController', FlowChartController)
  .filter("notEmpty",
      function () {
          return function (object) {
              var filteredObj = {};
              angular.forEach(object, function (val, key) {
                  if (val != null) {
                      if (typeof(val) === "object") {
                          if (Object.keys(val).length > 0) {
                              filteredObj[key] = val;
                          }
                      } else if (typeof(val) === "string") {
                          if (val.trim() !== "") {
                              filteredObj[key] = val;
                          }
                      } else {
                          filteredObj[key] = val;
                      }
                  }
              });
              return "filteredObj";
          };
      });


function FlowChartController($scope, $translate, HeaderService, FlowChartService, propertyService, filterService, DeclarationService, Toast, authService, $anchorScroll, $location, $timeout, $state ) {
  var vm = this;

  $scope.flow = {};

  $scope.folderUuid = [];

  HeaderService.setTitle($translate.instant('COMMON.FLOWCHART'))
  activate();

  vm.updateCollapse = updateCollapse;
  vm.propertyValues = propertyService.getAllPropertyValues();
  vm.propertyFilter = propertyFilter;


  vm.showing = "";
  vm.startedit = false;
  vm.saveShow = false;
  vm.alle = false;
  vm.minesager= false;
  vm.editing = false;

  vm.clickcreationDate = true;
  vm.clickcpr = true;
  vm.clickmainCharge = false;
  vm.clickefternavn = false;
  vm.clickfornavn = false;

  $scope.emptyOrNull = function(item) {
   return !(item.Message === null || item.Message.trim().length === 0)
  }

  // on page load, get the data
  $timeout(function() {
    loaddata($state.params.type, '@rm:creationDate', 'true');
  }, 0);


function propertyFilter(array, query) {
		return filterService.propertyFilter(array, query);
	}



    function gotoCase(caseNumber) {
        $state.go('declaration.show', { caseid: caseNumber, type: $state.params.type });
    }

    vm.gotoCase = gotoCase;


 function updateCollapse() {
     vm.collapse = !vm.collapse;
   }


  function activate() {
    $scope.isLoading = true;

    FlowChartService.getEntries("total").then(function (response) {

    vm.total = {};
                             vm.total.ongoing = response.ongoing;
                             vm.total.arrestanter = response.arrestanter;
                             vm.total.observation = response.observation;
                             vm.total.user = response.user;

                             vm.showUser = (vm.total.user != " -bruger ikke fundet-");

                             vm.total.ventendegr = response.ventendegr;
                             vm.total.waitinglist = response.waitinglist;
                       });






  }

  function loaddata(value, sort, desc) {
    $state.go('flowchart', {
      type: value
    }).then(function(state) {
      vm.showing = value;
      vm.currentCard = value;

      return FlowChartService.getEntries(value, sort, desc);
    }).then(function (response) {
      vm.ongoing = response.entries;
    });
  }



  vm.loaddata = loaddata;





  function save(nodeuuid, doctor, socialworker, psychologist, status) {

    DeclarationService.update($scope.flow)
    			.then(function (response) {
    				Toast.show('Ændringerne er gemt');
    				lockedForEdit(false);
    				vm.editperid = "";
    				vm.startedit = false;
    				vm.saveShow = false;

                    vm.updateCard(response);


                    $timeout(function () {

                        $location.hash("top_" + response["node-uuid"]+30);
                        $anchorScroll();
                    })
    			});

  }

  vm.save = save;

  function formatEmpty(value) {
      if (value == undefined) {
          return "";
    }
    else {
        return value;
    }
  }

  vm.formatEmpty = formatEmpty;



    function updateCard(i) {
         DeclarationService.get(i.caseNumber).then(function (response) {

                var val = angular.element(document.getElementById("statusDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.status);
                var val = angular.element(document.getElementById("samtykkeDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.samtykkeopl);


                var val = angular.element(document.getElementById("arrestDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.arrest);
                var val = angular.element(document.getElementById("tolksprogDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.tolksprog);


                var val = angular.element(document.getElementById("socialworkerDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.socialworker);
                var val = angular.element(document.getElementById("fritidvedDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.fritidved);


                var val = angular.element(document.getElementById("doctorDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.doctor);
                var val = angular.element(document.getElementById("kommentarDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.kommentar);
                var val = angular.element(document.getElementById("oplysningerEksterntDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.oplysningerEksternt);

                var val = angular.element(document.getElementById("psychologistDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.psychologist);
                var val = angular.element(document.getElementById("kvalitetskontrolDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.kvalitetskontrol);


                var val = angular.element(document.getElementById("psykologfokusDisplay_"+ response["node-uuid"]));
                val[0].innerText = formatEmpty(response.psykologfokus);

                });
    }

    vm.updateCard = updateCard;


    function editCase(i) {

    var currentUser = authService.getUserInfo().user.userName

          return (DeclarationService.get(i.caseNumber).then(function (response) {

            // init locked4edit

            if (response.locked4edit == null) {
                response.locked4edit = false;
            }


            if (response.locked4edit) {
                if (response.locked4editBy != currentUser) {
                    alert("sagen er låst for redigering af " + response.locked4editBy);
                    vm.startedit = false;
                    vm.saveShow = false;
                    vm.editing=false
                    return false;
                }
            }

            $scope.flow["samtykkeopl"] = response.samtykkeopl;
            $scope.flow["kommentar"] = response.kommentar;
            $scope.flow["oplysningerEksternt"] = response.oplysningerEksternt;
            $scope.flow["arrest"] = response.arrest;
            $scope.flow["tolksprog"] = response.tolksprog;
            $scope.flow["psykologfokus"] = response.psykologfokus;
            $scope.flow["fritidved"] = response.fritidved;
            $scope.flow["kvalitetskontrol"] = response.kvalitetskontrol;
            $scope.flow["node-uuid"] = response["node-uuid"];
            $scope.flow["psychologist"] = response.psychologist;
            $scope.flow["socialworker"] = response.socialworker;
            $scope.flow["doctor"] = response.doctor;
            $scope.flow["status"] = response.status;


            vm.editperid = response["node-uuid"]
            vm.startedit = true;
            vm.saveShow = true;

            lockedForEdit(true);

            return true;

        }));


    }


  function checkif() {
//  ng-if="vm.checkif(collapsed)"
    debugger;
  }

  vm.checkif = checkif;


    function cancel(i) {
        lockedForEdit(false);
        vm.editperid = "";
        vm.startedit = false;
        vm.saveShow = false;

        $timeout(function () {
            $location.hash("top_" + i)+30;
            $anchorScroll();
        })


    }

    vm.cancel = cancel;


    vm.editCase = editCase;

  	function lockedForEdit(lock) {

  		var currentUser = authService.getUserInfo().user.userName
  		var locked = {
  			'node-uuid': $scope.flow['node-uuid'],
  			locked4edit: lock,
  			locked4editBy: lock ? currentUser : {}
  		};

  		DeclarationService.update(locked);
  	}



  	function visitate(i, event) {

        var currentUser = authService.getUserInfo().user.userName;

        DeclarationService.get(i.caseNumber).then(function (response) {

            // init locked4edit

            if (response.locked4edit == null) {
                response.locked4edit = false;
            }


            if (response.locked4edit) {
                if (response.locked4editBy != currentUser) {
                    alert("sagen er låst for redigering af " + response.locked4editBy);
                    vm.startedit = false;
                    vm.saveShow = false;
                    vm.editing = false

                    // revert click
                    var checkbox = event.target;
                    checkbox.checked = !(checkbox.checked);

                    return false;
                }
            }
            else {
                var str = {"box1" : i.box1, "box2" : i.box2, "box3" : i.box3, "box4" : i.box4, "box5" : i.box5, "box6" : i.box6};
                FlowChartService.setVisitatorData(JSON.stringify(str), i.node_uuid);
            }
        });
    }

    vm.visitate = visitate;
}
