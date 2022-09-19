'use strict';

angular
  .module('oda.authorityMail')
  .controller('AuthorityMailController', AuthorityMailController);

function AuthorityMailController($scope, $mdDialog, Toast, authorityMail, propertyService, filterService, $stateParams, $state, practitionerService, sessionService ) {
  var vm = this;

  vm.payload = {};
  vm.payload.nodeRefs = [];
  vm.payload.defaultbody = false;
  vm.payload.useSignature = false;
  vm.payload.body = "";

  vm.payload.removeSignatureFromEmail = false;

  vm.selectedFiles = $scope.selectedContent;


  vm.properties = propertyService.getAllPropertyValues();

  vm.propertyFilter = propertyFilter;
  vm.send = send;
  vm.cancel = cancel;
  vm.loading = false;
  vm.showSignitureCheckBox = false;

  vm.payload.caseid = $stateParams.caseid;


    if (Object.keys($stateParams.emailPayload).length !== 0) {
        vm.payload.subject = $stateParams.emailPayload.subject;
        vm.payload.authority = $stateParams.emailPayload.authority;
        vm.payload["body"] = $stateParams.emailPayload.body;
        vm.payload.useSignature = true;
        vm.selectedDefaultBody = $stateParams.selectedDefaultBody;
    }
    else {
        vm.selectedDefaultBody = "ingen";
    }

    // default the signature to the email
    var userName = sessionService.getUserInfo().user.userName;
    practitionerService.getSignatureText(userName).then(function(response) {
        var userSigText = response.data.text;
        vm.payload.body = "\nmed venlig hilsen\n\n" + userSigText;
    });

    // $scope.$watch('vm.payload.removeSignatureFromEmail', function (newVal) {
    //
    //     console.log("newVal");
    //     console.log(newVal);
    //
    //     console.log("vm.payload.removeSignatureFromEmail");
    //     console.log(vm.payload.removeSignatureFromEmail);
    //     if (newVal) {
    //             vm.payload.body = "";
    //     }
    //     else {
    //             var userName = sessionService.getUserInfo().user.userName;
    //             console.log(userName);
    //
    //             practitionerService.getSignatureText(userName).then(function(response) {
    //                 console.log("response")
    //                 console.log(response.data.text);
    //                 var userSigText = response.data.text;
    //
    //
    //                 // check if the user has selected a defaultbody and act acordingly
    //                 console.log("vm.selectedDefaultBody");
    //                 console.log(vm.selectedDefaultBody);
    //
    //                 if (vm.selectedDefaultBody == "ingen") {
    //                     vm.payload.body = "\nmed venlig hilsen\n\n" + userSigText;
    //                 }
    //                 else {
    //                     vm.payload.body = vm.payload.body + "\n\n" + userSigText;
    //                 }
    //
    //
    //             });
    //
    //     }
    // })


  activated()

  checkSignitureAvailibility();



    vm.defaultBodyText = [
        {model : "ingen"},
        {model : "send"},
        {model : "returnering"}
    ];






  function preview() {
      authorityMail.getPreview(vm.payload).then( function (response) {
        $state.go('document', { doc: response.data.previewNode, tmpcrumb: $scope.crumbs, tmpNodeRef: $scope.folderUuid, showBackToEmail : true, emailPayload : vm.payload, selectedFiles : vm.selectedFiles, selectedDefaultBody : vm.selectedDefaultBody });
      });
  }
  vm.preview = preview;

  function activated() {
    vm.selectedFiles.forEach(file => {
     vm.payload.nodeRefs.push(file.nodeRef);
    });
  }

  function propertyFilter(array, query) {
    return filterService.propertyFilter(array, query);
  }



  function getDefaultMailBody(decl, dropdown) {
      authorityMail.getDefaultMailBody(decl, dropdown).then( function(response) {

          vm.payload.body = response.text;

          var userName = sessionService.getUserInfo().user.userName;
          practitionerService.getSignatureText(userName).then(function(responseSig) {
              var userSigText = responseSig.data.text;

              vm.payload.body = vm.payload.body + "\n\n" + userSigText;
              vm.payload.body += "\n\nTel. +45 7847 2640"
              vm.payload.body += "\nAUH Psykiatrien ▪ Retspsykiatrisk Afdeling, Indgang L"
              vm.payload.body += "\nTyge Søndergaards Vej 26 \▪ DK-8200 Aarhus N"
          });
      });
  }

    $scope.$watch('vm.selectedDefaultBody', function (newVal) {
        if (newVal == "ingen") {
            // vm.payload.body = "";

            var userName = sessionService.getUserInfo().user.userName;
            practitionerService.getSignatureText(userName).then(function(response) {
                var userSigText = response.data.text;
                vm.payload.body = "\nmed venlig hilsen\n\n" + userSigText;
                vm.payload.body += "\n\nTel. +45 7847 2640"
                vm.payload.body += "\nAUH Psykiatrien ▪ Retspsykiatrisk Afdeling, Indgang L"
                vm.payload.body += "\nTyge Søndergaards Vej 26 \▪ DK-8200 Aarhus N"
            });


        }
        else {
            if ((Object.keys($stateParams.emailPayload).length !== 0)) {
                // do nothing
            }
            else {
                // vm.payload.body = "";
            }
            getDefaultMailBody(vm.payload.caseid, vm.selectedDefaultBody);
        }
    })




    $scope.$watch('vm.payload.useSignature', function (newVal) {
        if (newVal) {
            // console.log(newVal);
        }
        else {
            // console.log(newVal);
        }
    })



  function send() {
    vm.loading = true;
    vm.payload.selectedDefaultBody = vm.selectedDefaultBody;

    return authorityMail.send(vm.payload)
      .then(function (response) {
        vm.loading = false;
        vm.cancel();
        Toast.show('Mailen blev sendt');
          // fixes bug when returning results in a messed up breadcrum
          $stateParams.emailPayload = [];
          $state.reload();
          return response;
      });

  }

  function previewAddSigniture() {



  }

  function cancel() {
    $mdDialog.cancel();
    $stateParams.emailPayload = [];
    $state.reload();
  }

    function checkSignitureAvailibility() {

            console.log("heyyyyy");

      authorityMail.areSignituresAvailable($stateParams.caseid, vm.selectedFiles).then(function(response) {
          vm.showSignitureCheckBox = response.data.available;
      })
    }



}


