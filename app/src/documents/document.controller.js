'use strict'




angular.module('openDeskApp.documents')
  .controller('DocumentController', DocumentController);


function DocumentController($scope, documentService, $stateParams, $state,
  documentPreviewService, alfrescoDownloadService, $window, HeaderService,$location, $mdDialog, authService, $http) {

  var vm = this;

  vm.doc = [];
  vm.plugin = [];
  vm.canEdit = false;
  vm.showEditVersionDialog = showEditVersionDialog;
  vm.acceptEditVersionDialog = acceptEditVersionDialog;
  vm.cancelDialog = cancelDialog;
  vm.updateCollapse = updateCollapse;
  vm.canRevertDocument = authService.isAuthorized('SiteEntryLockManager');
  vm.showBackToSearch = $stateParams.showBackToSearch;
  vm.showBackToCase = $stateParams.showBackToCase;



  if ($location.search().latest == undefined) {
    vm.latest = true;
  }
  else {
    vm.latest = $location.search().latest == "true";
  }

  function showAdminCancelEdit() {
      if (authService.isAuthorized('ALFRESCO_ADMINISTRATORS') != undefined) {
          authService.isAuthorized('ALFRESCO_ADMINISTRATORS').then(function (response) {
              vm.showAdminForceUnlock = true;
          })
      }
  }



  function forceUnlockDocument() {
      documentService.forceUnlock("workspace://SpacesStore/" + selectedDocumentNode);
          $state.reload();



  }

  vm.forceUnlockDocument = forceUnlockDocument;


  function back() {
      if (Object.keys($stateParams.tmpcrumb).length) {
          var splittedpath = vm.doc.location.path.split('/');
          var id = splittedpath[4];

          if (id != undefined) {
            $state.go('declaration.show.documents', { caseid: id, breadcrumbPath: $stateParams.tmpcrumb, tmpNodeRef : $stateParams.tmpNodeRef });
          }
          else {
            $window.history.back();
          }

      }
  }
  vm.back = back;

  function backToCase() {
      var splittedpath = vm.doc.location.path.split('/');
      var id = splittedpath[4];
      $state.go('declaration.show.documents', { caseid: id });

  }
  vm.backToCase = backToCase;


  function backToEmail()  {
      $state.go('declaration.show.documents', { caseid: $stateParams.emailPayload.caseid, breadcrumbPath: $stateParams.tmpcrumb, tmpNodeRef : $stateParams.tmpNodeRef, emailPayload : $stateParams.emailPayload, selectedFiles :  $stateParams.selectedFiles, selectedDefaultBody : $stateParams.selectedDefaultBody});
  }
  vm.backToEmail = backToEmail;


    function backToReport()  {
        // delete the tmp chart
        documentService.deleteTmpChartFile(vm.tmpChartNodeRef);
        $state.go('administration.reports', {});
    }
    vm.backToReport = backToReport;

  function backToSearch()  {
      $state.go('declaration.advancedSearch', { searchquery: $stateParams.searchquery });
  }
  vm.backToSearch = backToSearch;



  function updateCollapse() {
    vm.collapse = !vm.collapse;
  }


   function cancelDialog() {
      $mdDialog.cancel()
    }


    vm.docHasParent = $location.search().versionId !== undefined
    vm.parentNodeId = $stateParams.doc
    vm.nodeId = vm.docHasParent ? $location.search().versionId : $stateParams.doc


    if (vm.docHasParent)
        vm.doc.store = 'versionStore://version2Store/'
    else
        vm.doc.store = 'workspace://SpacesStore/'

  vm.updatePreview = loadPreview;
  vm.goBack = goBack;
  vm.goToLOEditPage = goToLOEditPage;
  vm.downloadDocument = downloadDocument;


  var selectedDocumentNode = $stateParams.doc;
  vm.selectedVersion = $location.search().version;

  vm.collapse = vm.selectedVersion != null ? false : true;


  angular.element($window).bind('resize', function () {
    setPDFViewerHeight();
    // manuall $digest required as resize event
    // is outside of angular
    $scope.$digest();
  });

  activate();

  function loadState() {

    var state = documentService.getState("workspace://SpacesStore/" + selectedDocumentNode).then(function (response) {
            vm.state = response.state;
            vm.editByText = "Dokumentet redigeres af "  + response.firstName + " " + response.lastName;
          });
  }


  function activate() {
    if ( !vm.docHasParent) {
        if (vm.latest) {
            vm.showRevertButton = false;
        }
        else {
         vm.showRevertButton = true;
        }
    }
    else if (vm.latest) {

        vm.showRevertButton = false;
    }
    else {
        vm.showRevertButton = true;
    }




      vm.showBackToEmail = $stateParams.showBackToEmail;
      vm.showBackToReport = $stateParams.showBackToReport;
      vm.tmpChartNodeRef = selectedDocumentNode;


    vm.showBackToSearch = $stateParams.showBackToSearch;

    console.log("hvad er backtosearch")
    console.log(vm.showBackToSearch);



    HeaderService.resetActions();
    setPDFViewerHeight();
    loadPreview();
    getDocument(vm.docHasParent);
    loadState();
    showAdminCancelEdit()

    //documentService.getVersions(selectedDocumentNode);

  }

  function goBack() {
    window.history.go(-2);

  }

  function setPDFViewerHeight() {
    var height = $(window).height() - 150 - $("header").outerHeight();

    $scope.iframeStyle = {
      "height": height + 'px',
      "width": "100%"
    };
  }

  function showEditVersionDialog () {
      $mdDialog.show({
        templateUrl: 'app/src/documents/view/confirmEditVersionDialog.html',
        scope: $scope,
        preserveScope: true,
        clickOutsideToClose: true
      })
    }

  function getDocument(revisioncall) {


        documentService.getDocument(selectedDocumentNode).then(function (response) {

            vm.doc = response.item;
            vm.docMetadata = response.metadata;
            vm.loolEditable = documentService.isLoolEditable(vm.doc.mimetype);

            vm.canEdit = vm.doc.permissions.userAccess.edit;


            documentService.getVersions(selectedDocumentNode).then(function (response) {
                vm.history = response;

                // if (revisioncall) {
                //     vm.history.latest_version = ""
                // }
                // else {
                //     vm.history.latest_version = response[0].version;
                // }
    });
  });
}

  function loadPreview() {


    vm.store = vm.doc.store;

    if (vm.docHasParent) {
          documentService.getThumbnail(vm.parentNodeId, vm.nodeId).then(function (response) {

                documentPreviewService.previewDocumentPlugin(response.data.nodeRef)
                  .then(function (plugin) {

                    vm.plugin = plugin;
                    $scope.config = plugin;
                    $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;
                    $scope.download = function () {
                      alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
                    };

                    if (plugin.initScope) {
                      plugin.initScope($scope);
                    }
                  });
                  })
  }
   else
        documentPreviewService.previewDocumentPlugin(vm.doc.store + vm.nodeId)
          .then(function (plugin) {
            vm.plugin = plugin

            $scope.config = plugin;
            $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;

            $scope.download = function () {
              alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
            };

            if (plugin.initScope) {
              plugin.initScope($scope);
            }

          })
  }

  //Goes to the libreOffice online edit page
  function goToLOEditPage() {
            documentService.getState("workspace://SpacesStore/" + selectedDocumentNode).then(function (response) {
            if (!response.state) {
                  documentService.markDocumentAsEditing("workspace://SpacesStore/" + selectedDocumentNode).then(function (response) {

                                                $state.go('lool', {
                                                                  'nodeRef': vm.doc.nodeRef, tmpcrumb: $stateParams.tmpcrumb, tmpNodeRef : $stateParams.tmpNodeRef
                                                                });

                                            });

            }

            else {
                $state.reload()

            }


//



            });


  }

  function downloadDocument() {
    var versionRef = vm.store + $stateParams.doc;
    alfrescoDownloadService.downloadFile(versionRef, vm.doc.location.file);
  }




  function acceptEditVersionDialog() {

      var selectedVersion = $location.search().version
            documentService.revertToVersion("workspace://SpacesStore/" + selectedDocumentNode, selectedVersion).then(
        function (response) {


          cancelDialog();
          $window.location.href = '#!/dokument/' + selectedDocumentNode;
        })
    }






}










