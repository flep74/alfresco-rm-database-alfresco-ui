'use strict';

angular
    .module('openDeskApp')
    .controller('AuthController', AuthController);

function AuthController(APP_CONFIG, $scope, $state, $http, $stateParams, authService, $mdDialog, sessionService, $window, loadingService) {
    var vm = this;
    var loginErrorMessage = angular.fromJson($stateParams.error);

    vm.login = login;
    vm.logout = logout;
    vm.loggedin = loggedin;
    vm.getUserInfo = getUserInfo;
    vm.errorMsg = loginErrorMessage ? loginErrorMessage : "";
    vm.showForgotDialog = showForgotDialog;
    vm.updateValidator = updateValidator;

    loadingService.setLoading(false);

    function getUserRoles() {
        vm.userRoles = authService.getUserRoles();
    }
    getUserRoles();

    function login(credentials) {
        authService.login(credentials.username, credentials.password)
        .then(function (response) {
            // If incorrect values            
            if (response.status == 403) {
                vm.form.password.$setValidity("loginFailure", false);
                vm.errorMsg = "Forkert brugernavn eller kodeord."
                return 
            } else if (response.status == 500) {
                vm.form.password.$setValidity("loginError", false);
                vm.errorMsg = "Forkert brugernavn eller kodeord."
                return
            }

            $http.get(`/alfresco/service/isActivated?userName=${credentials.username}`)
            .then(function(response) {
                console.log(response.data.member)
                if (response.data.member) {
                    authService.getUser(credentials.username)
                    .then(function (response) {
                        vm.user = response;
                        restoreLocation();
                    });
                } else {
                    vm.errorMsg = 'Du er ikke aktiveret. Kontakt din nærmeste leder.'
                    vm.logout()
                }
            })
        })
    }

    function restoreLocation() {
        var retainedLocation = sessionService.getRetainedLocation();
        if (!retainedLocation || retainedLocation === undefined) {
            $state.go(APP_CONFIG.landingPage);
        } else {
            $window.location = retainedLocation;
        }
    }

    function logout() {
        //chatService.logout();
        delete vm.user;
        authService.logout();
    }

    function loggedin() {
        return authService.loggedin();
    }

    function updateValidator() {
        if (vm.form.password.$error.loginFailure)
            vm.form.password.$setValidity("loginFailure", true);
    }

    function forgotPasswordCtrl($scope, $mdDialog) {
        var dlg = this;
        dlg.emailSent = false;

        dlg.cancel = function () {
            return $mdDialog.cancel();
        };

        dlg.updateValidators = function () {
            if (dlg.form.email.$error.emailNotExists)
                dlg.form.email.$setValidity("emailNotExists", true);
        };

        dlg.forgotPassword = function () {
            if (!dlg.email) return;

            authService.changePassword(dlg.email).then(
                function success(response) {
                    dlg.emailSent = true;
                },

                function onError(response) {
                    // If email doesn't exist in system
                    if (response.status !== 200)
                        dlg.form.email.$setValidity("emailNotExists", false);
                }
            );
        };
    }

    function showForgotDialog(ev) {
        $mdDialog.show({
            controller: forgotPasswordCtrl,
            controllerAs: 'dlg',
            templateUrl: 'app/src/authentication/view/forgotPasswordDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }

    function getUserInfo() {
        var userInfo = authService.getUserInfo();
        return userInfo;
    }

}
