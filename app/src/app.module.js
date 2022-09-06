'use strict';

angular
    .module('openDeskApp', [
        'ngSanitize',
        'ngMaterial',
        'ngMessages',
        'ngCookies',
        'ui.router',
        'angular.filter',
        'rt.encodeuri',
        'ngResource',
        'pdf',
        'swfobject',
        'isteven-multi-select',
        'openDeskApp.init',
        'openDeskApp.auth',
        'openDeskApp.backendConfig',
        'openDeskApp.translations.init',
        'openDeskApp.header',
        'openDeskApp.lool',
        'openDeskApp.documents',
        'openDeskApp.systemsettings',
        'oda.waitinglist',
        'oda.sharedDocuments',
        'oda.flowchart',
        'm43nu.auto-height',
        'dcbImgFallback',
        'openDeskApp.declaration',
        'openDeskApp.filebrowser',
        'uiCropper',
        'md.data.table',

        /*DO NOT REMOVE MODULES PLACEHOLDER!!!*/ //openDesk-modules
        /*LAST*/
        'openDeskApp.translations'
    ]) //TRANSLATIONS IS ALWAYS LAST!
    .config(config)
    .run(function ($rootScope, $state, APP_CONFIG) {
        $rootScope.ssoLoginEnabled = APP_CONFIG.ssoLoginEnabled;
        angular.element(window.document)[0].title = APP_CONFIG.appName;
        $rootScope.appName = APP_CONFIG.appName;
        $rootScope.logoSrc = APP_CONFIG.logoSrc;
        if ($state.current.url == "^")
            $state.go(APP_CONFIG.landingPage);
    });

function config(USER_ROLES, $stateProvider, $mdDateLocaleProvider, $mdThemingProvider) {

    var regionMidtMap = $mdThemingProvider.extendPalette('red', {
        '500': '#990033',
    });

    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('regionMidt', regionMidtMap);

    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
        .primaryPalette('regionMidt');

    $stateProvider.decorator('data', function (state, parent) {
        var stateData = parent(state);

        state.resolve = state.resolve || {};
        state.resolve.authorize = ['authService', '$q', 'sessionService', '$state', '$rootScope', '$stateParams', 'propertyService',
            function (authService, $q, sessionService, $state, $rootScope, $stateParams, propertyService) {
                var d = $q.defer();

                if (authService.isAuthenticated())
                    resolveUserAfterAuthorization(authService, $stateParams, propertyService, d);

                else if ($rootScope.ssoLoginEnabled) {
                    authService.ssoLogin().then(function (response) {
                        if (authService.isAuthenticated())
                            resolveUserAfterAuthorization(authService, $stateParams, propertyService, d);
                        else rejectUnauthenticatedUser($state, sessionService, d);
                    });
                }

                else rejectUnauthenticatedUser($state, sessionService, d);

                return d.promise;
            }
        ];
        return stateData;
    });

    function resolveUserAfterAuthorization(authService, $stateParams, propertyService, defer) {
        authService.setUserRolesForSite('retspsyk').then(function (roles) {
            if (authService.isAuthorized($stateParams.authorizedRoles)) {
                // I also provide the user for child controllers
                defer.resolve(authService.user);
                propertyService.initPropertyValues();
            }
        });
    }

    function rejectUnauthenticatedUser($state, sessionService, defer) {
        defer.reject('Please login');
        sessionService.retainCurrentLocation();
        $state.go('login');
    }

    $stateProvider.state('site', {
        abstract: true,
        views: {
            'header@': {
                templateUrl: 'app/src/header/header.view.html'
            },
            'footer@': {
                template: '<img src="app/assets/images/>rm-weblogo.jpg" class="rm-logo">'
            }
        },
        params: {
            authorizedRoles: [USER_ROLES.user]
        }
    });

    $mdDateLocaleProvider.firstDayOfWeek = 1;

    $mdDateLocaleProvider.formatDate = function (date) {
        if (date == undefined)
            return '';
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        return day + '/' + month + '/' + year;

    };
}
