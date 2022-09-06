'use strict';

angular
	.module('openDeskApp.declaration')
	.controller('PatientInfoController', PatientInfoController);

function PatientInfoController($scope, $state, $stateParams, $mdDialog, DeclarationService, filterService, cprService, authService, Toast, HeaderService, $filter, $timeout, $q) {

	var vm = this;
	$scope.DeclarationService = DeclarationService;
	$scope.editPatientData = false;
	$scope.case;
	$scope.isLoading = false;
	vm.backtosearch = false;

	// todo remove this as its not used anymore
	vm.enforceSolar = $stateParams.enforceSolarDelay;
	$scope.propertyFilter = propertyFilter;
	$scope.addNewBidiagnosis = addNewBidiagnosis;
	vm.lookupCPR = lookupCPR;
	vm.isNumber = isNumber;
	vm.makeDeclarationDocument = makeDeclarationDocument;
	vm.makeBerigtigelsesDocument = makeBerigtigelsesDocument;
	vm.makeSuppleredeUdttDocument = makeSuppleredeUdttDocument;
	vm.gobacktosearch = gobacktosearch;

	vm.createdDateBeforeEdit;
	vm.declaratiotionDateBeforeEdit;

	vm.declarationState = "";

	vm.isOpenForTMPEdit = false;


	vm.afslutwarning_referingAgency = false;
	vm.afslutwarning_journalNumber = false;
	vm.afslutwarning_rulingCourt = false;
	vm.afslutwarning_rulingDate = false;
	vm.afslutwarning_mainCharge = false;
	vm.afslutwarning_status = false;


	vm.afslutwarning_etnicitet = false;
	vm.afslutwarning_etnicitetMother = false;
	vm.afslutwarning_etnicitetFather = false;

	vm.afslutwarning_placement = false;
	vm.afslutwarning_sanktionsforslag = false;

	vm.afslutwarning_mainCharge = false;

	vm.afslutwarning_observationDate = false;
	vm.afslutwarning_declarationDate = false;


	vm.waitPromiseSupopl = function(state) {
		if ($scope.case.closedWithoutDeclaration) {
			$scope.closeCaseParams = {closed : 'no-declaration'}
		}
		else {
			$scope.closeCaseParams = {closed : ''}
		}
		vm.declarationState = state;

		HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
		HeaderService.addAction('COMMON.EDIT', 'edit', editCase);
		HeaderService.addAction('DECLARATION.LOCK_TMP', 'lock', $scope.closeCase);
		vm.enforceSolar = false;

		// var defer = $q.defer();
		// $timeout(function() {

		// 	}, 15000);
		// return defer.promise;
	};


//show/hide flag for normal or bua users
	DeclarationService.isBUAUser().then(function(response) {
		console.log("to be bua or not to be?...");
		console.log(response);
		vm.isBua = response;
	});

	vm.waitPromiseNormal = function(declarationSettings_, state) {
		vm.declarationState = state;
		HeaderService.addAction('Opret erklæring', 'description', makeDeclarationDocument, false)
		HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
		HeaderService.addAction('DECLARATION.LOCK', 'lock', lockCaseDialog);
		HeaderService.addAction('COMMON.EDIT', 'edit', editCase);
		vm.enforceSolar = false;
	};

	vm.waitPromiseCanUnlock = function() {
		HeaderService.addAction('DECLARATION.UNLOCK', 'lock_open', unLockCaseDialog);
		vm.enforceSolar = false;
	};

	$scope.$on('$destroy', function () {
		if ($scope.case.locked4edit) {
			lockedForEdit(false);
		}
	});

    if (Object.keys($stateParams.searchquery).length) {
        vm.backtosearch = false;
        HeaderService.updateBacktosearch($stateParams.searchquery);
    }

	activated();

	function makeDeclarationDocument() {

		// check if all mandatory fields have been completed

		if ($scope.case.referingAgency == undefined || $scope.case.journalNumber == undefined ||
			$scope.case.mainCharge == undefined || $scope.case.status == undefined		   ) {

			Toast.show('Følgende felter mangler at blive udfyldt');
			vm.afslutwarning_referingAgency = ($scope.case.referingAgency == undefined);
			vm.afslutwarning_journalNumber = ($scope.case.journalNumber == undefined);
			vm.afslutwarning_mainCharge = ($scope.case.mainCharge == undefined);
			vm.afslutwarning_status = ($scope.case.status == undefined);

			if ($scope.case.declarationType == 'kendelse') {
				vm.afslutwarning_rulingDate = ($scope.case.rulingDate == undefined);
				vm.afslutwarning_rulingCourt = ($scope.case.rulingCourt == undefined);
			}


			// scroll down
			window.scrollBy(0,650);

		}
		else  {
			if ($scope.case.declarationType == 'kendelse' && ($scope.case.rulingDate == undefined || $scope.case.rulingCourt == undefined)) {
				vm.afslutwarning_rulingDate = ($scope.case.rulingDate == undefined);
				vm.afslutwarning_rulingCourt = ($scope.case.rulingCourt == undefined);

				console.log("hvad er vm.afslutwarning_rulingCourt");
				console.log(vm.afslutwarning_rulingCourt);

				Toast.show('Følgende felter mangler at blive udfyldt');
			}
			else {
				DeclarationService.makeDeclarationDocument($scope.case)
					.then(function (response) {
						$state.go('document', {doc: response.id});
					});
			}
		}
	}

	function makeBrevDocument() {
		DeclarationService.makeBrevDocument($scope.case)
			.then(function (response) {
				$state.go('document', { doc: response.id });
			});
	}

	function makeBerigtigelsesDocument() {
		DeclarationService.makeBerigtigelsesDocument($scope.case)
			.then(function (response) {
				// $state.go('document', { doc: response.id, showBackToCase : true });
				Toast.show('Berigtigelse oprettet');
			});
	}

	function makeSuppleredeUdttDocument() {
		DeclarationService.makeSuppleredeUdtDocument($scope.case)
			.then(function (response) {
				// $state.go('document', { doc: response.id, showBackToCase : true });
				Toast.show('Suppleredeudtalelse oprettet');
			});
	}

	function shortcutToFlowchart() {
				$state.go('flowchart', { declarationShortcutId: $scope.case["node-uuid"], category: vm.declarationState });
	}

	function gobacktosearch() {
        $state.go('declaration.advancedSearch', { searchquery: $stateParams.searchquery });
	}

	function canCreateDeclarationDocument(declaration) {
		var result = true;
		var props = ['referingAgency', 'declarationType', 'journalNumber']
		var missingProps = []


		if (declaration.declarationType == 'kendelse') {
			props.push('rulingDate')
			props.push('rulingCourt')

		}

		for (var p in props) {
			if (!declaration[props[p]]) {
				result = false;
				missingProps.push(props[p])
			}
		}
		return [result, missingProps]
	}

	function activated() {
		if (Object.keys($stateParams.caseData).length) {
			setEverything($stateParams.caseData)
		} else {
			DeclarationService.get($stateParams.caseid)
				.then(function (response) {
					setEverything(response)
				})
		}
	}

	function setEverything(response) {

		$scope.case = response;
		var bua = response.bua ? ' (BUA)' : '';
		HeaderService.resetActions();
		HeaderService.setTitle(response.firstName + ' ' + response.lastName + ' ( ' + response.caseNumber + ' / ' + response.cprNumber + ' )' + bua);
		HeaderService.setCaseId(response.caseNumber);
		HeaderService.setClosed(response.closed);
		HeaderService.setClosedSupl(false);
		
		var canCreate = canCreateDeclarationDocument(response)

		var declarationSettings = {
			disabled: !canCreate[0],
			tooltip: canCreate[1].length > 0 ? canCreate[1] : undefined
		}

		var shortCutSettings = {
			tooltip: "Genvej til flowchart"
		}

		if ($scope.case.hasOwnProperty('returnOfDeclarationDate')) {
			$scope.case.returnOfDeclarationDate = new Date($scope.case.returnOfDeclarationDate);
		}

		if (vm.backtosearch) {
            HeaderService.addAction('Tilbage til søgning', 'description', gobacktosearch, false)
        }

		// only show button for flowchart if it has a state that will make it visible inside the flowchart

		DeclarationService.getStateOfDeclaration(response.caseNumber).then (function(stateReponse) {

			// either normalediting or speciel edit if case has been reopened
			if (stateReponse.data.temporaryEdit) {

				// do speciel edit
				vm.declarationState = stateReponse.data.state;
				vm.isOpenForTMPEdit = true;


				// check if you have to wait for solar consistency - triggering edit on a case that was just saved messes up the menu if solr hasn't finished indexing
				if (stateReponse.data.hasAspectSupopl == true) {

					if (vm.enforceSolar) {
						vm.waitPromiseSupopl(stateReponse.data.state);
					}
					else {
						HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
						HeaderService.addAction('DECLARATION.SUPPLEREDEOPL_OPRET', 'create', makeSuppleredeUdttDocument);
						HeaderService.addAction('COMMON.EDIT', 'edit', editCase);

						HeaderService.setClosedSupl(true);



						if ($scope.case.closedWithoutDeclaration) {
							$scope.closeCaseParams = {closed : 'no-declaration'}
						}
						else {
							$scope.closeCaseParams = {closed : ''}
						}
						 HeaderService.addAction('DECLARATION.LOCK_TMP', 'edit', $scope.closeCase);

					}
				}
				else {


					// # https://redmine.magenta-aps.dk/issues/46005#note-11
					HeaderService.addAction('DECLARATION.BERIGTIGELSE_OPRET', 'create', makeBerigtigelsesDocument);

					HeaderService.addAction('COMMON.EDIT', 'edit', editCase);

					if ($scope.case.closedWithoutDeclaration) {
						$scope.closeCaseParams = {closed : 'no-declaration'}
					}
					else {
						$scope.closeCaseParams = {closed : ''}
					}
					HeaderService.addAction('DECLARATION.LOCK_TMPOPENEDIT', 'edit', $scope.closeCase);
				}
			}
			else {
				vm.declarationState = stateReponse.data.state;
				if (!response.closed) {

					if (vm.enforceSolar) {
						vm.waitPromiseNormal(declarationSettings, stateReponse.data.state);
					}
					else {
						HeaderService.addAction('Opret erklæring', 'description', makeDeclarationDocument, false)
						HeaderService.addAction('Opret brev', 'description', makeBrevDocument)
						HeaderService.addAction('Genvej til flowchart', 'bar_chart', shortcutToFlowchart);
						HeaderService.addAction('DECLARATION.LOCK', 'lock', lockCaseDialog);
						HeaderService.addAction('COMMON.EDIT', 'edit', editCase);
					}
				} else {
					if (HeaderService.canUnlockCases()) {
						if (vm.enforceSolar) {
							vm.waitPromiseCanUnlock();
						}
						else {
							HeaderService.addAction('DECLARATION.UNLOCK', 'lock_open', unLockCaseDialog);
						}

					}
				}
			}
		});
	}



	function isOpenForTMPEdit() {
		return DeclarationService.getStateOfDeclaration($scope.case.caseNumber).then (function(stateReponse) {
			return (stateReponse.data.temporaryEdit);
		});
	}

	function propertyFilter(array, query) {
		return filterService.propertyFilter(array, query);
	}

	 function addNewBidiagnosis() {

        if (($scope.case.hasOwnProperty('biDiagnoses'))) {
            if ($scope.case.biDiagnoses.indexOf(null) < 0) {
                  $scope.case.biDiagnoses.push(null);
                }
        }
        else {
            $scope.case.biDiagnoses = new Array();
            $scope.case.biDiagnoses.push(null);
        }
    }

	function lookupCPR() {
		cprService.getCPRData($scope.case.cprNumber)
			.then(function (response) {
				var res = response.data[0];
				var name = res.NAVN.split(',');

				$scope.case.firstName = name[1];
				$scope.case.lastName = name[0];
				$scope.case.address = res.GADE;
				$scope.case.postbox = res.POSTNR;
				$scope.case.city = res.BY;
			});
	}

	function isNumber(number) {
		return isNaN(number) ? false : true;
	}

	function lockCaseDialog() {

		DeclarationService.get($stateParams.caseid)
			.then(function (response) {
				vm.createdDateBeforeEdit = response.creationDate;
				vm.declaratiotionDateBeforeEdit = response.declarationDate;

				var currentUser = authService.getUserInfo().user.userName;

				if (response.locked4edit) {
					if (currentUser != $scope.case.locked4editBy) {
						alert("sagen er låst for redigering af " + response.locked4editBy + " og kan ikke afsluttes før brugeren vælger gem.");
						return false;
					}
				}
				else {
					$mdDialog.show({
						templateUrl: 'app/src/declaration/view/lock-dialog.html',
						scope: $scope, // use parent scope in template
						preserveScope: true, // do not forget this if use parent scope
						clickOutsideToClose: true
					});
				}


		});
	}

	function lockCase() {
		if ($scope.case.closedWithoutDeclaration) {
			$scope.closeCaseParams = {closed : 'no-declaration'}
		}
		else {
			$scope.closeCaseParams = {closed : ''}
		}
		$scope.closeCase();
	}

    function unLockCaseDialog() {
        $mdDialog.show({
            templateUrl: 'app/src/declaration/view/unLock-dialog.html',
            scope: $scope, // use parent scope in template
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    }

	function canAccessUndoCloseCase() {
		var roles = authService.getUserRoles();
		console.log("roles");
		console.log(roles);

		if (!roles) return false;

		if (roles.indexOf('SiteEntryLockManager') > -1) {
			return true;
		}
		return false;
	}

	$scope.canAccessUndoCloseCase = canAccessUndoCloseCase;

    $scope.unlockCase = function () {
console.log("duff");

		if (($scope.unlockCaseParams == 'undoCloseCase')) {
			$mdDialog.cancel();
			DeclarationService.undoCloseCaseEntry($scope.case)
				.then(function (response) {
					HeaderService.resetActions();
					activated();
				});
		}
		else {
			DeclarationService.unlock($scope.case, $scope.unlockCaseParams)
				.then(function () {

					Toast.show('Sagen er låst op')
					$mdDialog.cancel();

					if (($scope.unlockCaseParams == 'reopenEdit')) {
						// open for edit
						vm.isOpenForTMPEdit = true;
						editCase()
					} else {
						HeaderService.resetActions();
						activated();
						vm.isOpenForTMPEdit = true;
					}
				});
		}
	}

	function editCase() {
		var currentUser = authService.getUserInfo().user.userName;

		// reload case, as it might have been locked by another user

        DeclarationService.get($stateParams.caseid)
                        .then(function (response) {
						vm.createdDateBeforeEdit = response.creationDate;
						vm.declaratiotionDateBeforeEdit = response.declarationDate;

                        if (response.locked4edit) {
							if (currentUser != $scope.case.locked4editBy) {
									alert("sagen er låst for redigering af " + response.locked4editBy);
									return false;
								}
                		}

                		$scope.editPatientData = true;
							lockedForEdit(true).then(function (response) {
								HeaderService.resetActions();

								// check if this was a usecase of reopening a case, then dont show lockCaseDialog, instead, just lock the case again after save has been finished. just extend savecase like closecase has been done.
								if (vm.isOpenForTMPEdit) {

									// if edit for sup then dont saveandclose - evt. lav et opslag og se om den har et aspekt..... her

									DeclarationService.getStateOfDeclaration(response.caseNumber).then (function(stateReponse) {
										if (stateReponse.data.hasAspectSupopl == true) {
											HeaderService.addAction('COMMON.SAVE', 'save', saveCase)
										}
										else {

											HeaderService.addAction('COMMON.SAVE', 'save', saveCase);
											// HeaderService.addAction('COMMON.SAVE', 'save', saveCaseAndClose);
										}
									});
								}
								else {
//									HeaderService.addAction('DECLARATION.SAVE_AND_LOCK', 'save', lockCaseDialog)
									HeaderService.addAction('COMMON.SAVE', 'save', saveCase)
								}

							});
                        })
	}

	function lockedForEdit(lock) {
		var currentUser = authService.getUserInfo().user.userName;
		var locked = {
			'node-uuid': $scope.case['node-uuid'],
			locked4edit: lock,
			locked4editBy: lock ? currentUser : {}
		};

		return DeclarationService.update(locked);
	}

	function saveCase() {
		$scope.case.fullName = $scope.case.firstName + ' ' + $scope.case.lastName;
		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};

		if (!$scope.case.hasOwnProperty("closedWithoutDeclaration")) {
				$scope.case.closedWithoutDeclaration = false;
		}

		$scope.case.closeCaseButtonPressed = false;


		DeclarationService.update($scope.case)
			.then(function () {
				$scope.editPatientData = false;
				activated();
				Toast.show('Ændringerne er gemt');


				// creationdate
				var before_formatted = $filter('date')(vm.createdDateBeforeEdit,'yyyy-MM-dd');
				var after_formatted = $filter('date')($scope.case.creationDate,'yyyy-MM-dd');

				var year_before = $filter('date')(vm.createdDateBeforeEdit,'yyyy');
				var year_after = $filter('date')($scope.case.creationDate,'yyyy');

				var updateCalculatedStat = (before_formatted != after_formatted);

				var dec_before_formatted = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy-MM-dd');
				var dec_after_formatted = $filter('date')($scope.case.declarationDate,'yyyy-MM-dd');

				var dec_year_before = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy');
				var dec_year_after = $filter('date')($scope.case.declarationDate,'yyyy');

				var dec_updateCalculatedStat = (dec_before_formatted != dec_after_formatted);

				if (updateCalculatedStat) {
					if (year_before == year_after) {
						DeclarationService.updateStat(year_after);
					}
					else {
						DeclarationService.updateStat(year_before);
						DeclarationService.updateStat(year_after);
					}
				}

				if (dec_updateCalculatedStat) {
					if (dec_year_before == dec_year_after) {
						DeclarationService.updateStat(dec_year_after);
					}
					else {
						DeclarationService.updateStat(dec_year_before);
						DeclarationService.updateStat(dec_year_after);
					}
				}
				$state.go('declaration.show', { caseid: $scope.case.caseNumber, enforceSolarDelay: false }, {reload: true});
			});
	}

	function saveCaseAndClose() {
		vm.isOpenForTMPEdit = false;

		$scope.case.fullName = $scope.case.firstName + ' ' + $scope.case.lastName;
		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};

		if (!$scope.case.hasOwnProperty("closedWithoutDeclaration")) {
			$scope.case.closedWithoutDeclaration = false;
		}

		$scope.case.closeCaseButtonPressed = false;


		DeclarationService.update($scope.case)
			.then(function () {
				$scope.editPatientData = false;
				activated();
				Toast.show('Ændringerne er gemt');


				// creationdate
				var before_formatted = $filter('date')(vm.createdDateBeforeEdit,'yyyy-MM-dd');
				var after_formatted = $filter('date')($scope.case.creationDate,'yyyy-MM-dd');

				var year_before = $filter('date')(vm.createdDateBeforeEdit,'yyyy');
				var year_after = $filter('date')($scope.case.creationDate,'yyyy');

				var updateCalculatedStat = (before_formatted != after_formatted);

				var dec_before_formatted = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy-MM-dd');
				var dec_after_formatted = $filter('date')($scope.case.declarationDate,'yyyy-MM-dd');

				var dec_year_before = $filter('date')(vm.declaratiotionDateBeforeEdit,'yyyy');
				var dec_year_after = $filter('date')($scope.case.declarationDate,'yyyy');

				var dec_updateCalculatedStat = (dec_before_formatted != dec_after_formatted);

				if (updateCalculatedStat) {
					if (year_before == year_after) {
						DeclarationService.updateStat(year_after);
					}
					else {
						DeclarationService.updateStat(year_before);
						DeclarationService.updateStat(year_after);
					}
				}

				if (dec_updateCalculatedStat) {
					if (dec_year_before == dec_year_after) {
						DeclarationService.updateStat(dec_year_after);
					}
					else {
						DeclarationService.updateStat(dec_year_before);
						DeclarationService.updateStat(dec_year_after);
					}
				}

				if ($scope.case.closedWithoutDeclaration) {
					$scope.closeCaseParams = {closed : 'no-declaration'}
				}
				else {
					$scope.closeCaseParams = {closed : ''}
				}

				// $state.reload;
				$scope.closeCase();

			});


	}

	$scope.closeCase = function () {


		$scope.case.locked4edit = false;
		$scope.case.locked4editBy = {};
		$scope.case.closed = true;

		if ($scope.closeCaseParams.closed == 'no-declaration') {
			$scope.case.closedWithoutDeclaration = true;
		}
		else {
			$scope.case.closedWithoutDeclaration = false;
		}

		$scope.case.closeCaseButtonPressed = true;

		$scope.case.closedWithoutDeclarationReason = $scope.closeCaseParams.reason;
		$scope.case.closedWithoutDeclarationSentTo = $scope.closeCaseParams.sentTo;
		$scope.case.returnOfDeclarationDate = $scope.closeCaseParams.returnOfDeclarationDate;


		// check mandatory fields
		// first, make a check if user wants to close with or without declaration

		if (!vm.isBua) {
			if ($scope.case.closedWithoutDeclaration) {

				DeclarationService.update($scope.case)
					.then(function () {

						// HeaderService.resetActions();
						// HeaderService.setClosed(true);
						// activated();
						// $mdDialog.cancel();
						$state.go('declaration.show', { caseid: $scope.case.caseNumber, enforceSolarDelay: false }, {reload: true});
					})

			}
			else {
				// #49701 mandatory
				if ($scope.case.ethnicity == undefined || $scope.case.motherEthnicity == undefined || $scope.case.fatherEthnicity == undefined ||

					$scope.case.placement == undefined || $scope.case.sanctionProposal == undefined ||

					$scope.case.mainCharge == undefined ||

					$scope.case.observationDate == undefined ||  $scope.case.declarationDate == undefined
				) {


					vm.afslutwarning_etnicitet = ($scope.case.ethnicity == undefined);
					vm.afslutwarning_etnicitetMother = ($scope.case.motherEthnicity == undefined);
					vm.afslutwarning_etnicitetFather = ($scope.case.fatherEthnicity == undefined);

					vm.afslutwarning_placement = ($scope.case.placement == undefined);
					vm.afslutwarning_sanktionsforslag = ($scope.case.sanctionProposal == undefined);

					vm.afslutwarning_mainCharge = ($scope.case.mainCharge == undefined);

					vm.afslutwarning_observationDate = ($scope.case.observationDate == undefined);
					vm.afslutwarning_declarationDate = ($scope.case.declarationDate == undefined);

					$scope.case.closedWithoutDeclarationReason = undefined;

					$scope.case.closedWithoutDeclarationSentTo = undefined;
					$scope.case.returnOfDeclarationDate = undefined;

					$scope.case.closedWithoutDeclaration = false;
					$scope.case.closed = false;

					$mdDialog.cancel();
					Toast.show('Følgende felter mangler at blive udfyldt');
				}
				else {
					DeclarationService.update($scope.case)
						.then(function () {

							// HeaderService.resetActions();
							// HeaderService.setClosed(true);
							// activated();
							// $mdDialog.cancel();
							$state.go('declaration.show', { caseid: $scope.case.caseNumber, enforceSolarDelay: false }, {reload: true});
						})
				}
			}
		}
		else {
			DeclarationService.update($scope.case)
				.then(function () {

					// HeaderService.resetActions();
					// HeaderService.setClosed(true);
					// activated();
					// $mdDialog.cancel();
					$state.go('declaration.show', { caseid: $scope.case.caseNumber, enforceSolarDelay: false }, {reload: true});
				})
		}
	}

	$scope.afbryd = function () {
    	console.log("true");
		vm.afslutwarning = true;
        $mdDialog.cancel();
	}
}







