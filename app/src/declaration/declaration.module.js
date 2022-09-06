'use strict';

angular.module('openDeskApp.declaration', ['oda.authorityMail', 'openDeskApp.filebrowser'])
  .config(config);

function config($stateProvider) {

  $stateProvider.state('declaration', {
    parent: 'site',
    url: '/erklaeringer',
    views: {
      'content@': {
        templateUrl: 'app/src/declaration/search/search.view.html',
        controller: 'DeclarationSearchController',
        controllerAs: 'vm'
      }
    }
  })
    .state('declaration.advancedSearch', {
      url: '/advanceret-soegning',
      params: {
                searchquery: {}
              },
      views: {
        'content@': {
          templateUrl: 'app/src/declaration/advancedSearch/advancedSearch.view.html',
          controller: 'AdvancedSearchController',
          controllerAs: 'vm'
        }
      }
    })
    .state('declaration.waitinglist', {
      url: '/venteliste',
      views: {
        'content@': {
          templateUrl: 'app/src/waitinglist/waitinglist.view.html',
          controller: 'WaitinglistController',
          controllerAs: 'vm'
        }
      }
    })
    .state('declaration.create', {
      url: '/opret',
      views: {
        'content@': {
          templateUrl: 'app/src/declaration/view/info-cards.html',
          controller: 'DeclarationCreateController',
          controllerAs: 'vm'
        }
      }
    })
    .state('declaration.create-bua', {
      url: '/opret-bua',
      views: {
        'content@': {
          templateUrl: 'app/src/declaration/view/info-cards.html',
          controller: 'DeclarationCreateController',
          controllerAs: 'vm'
        }
      }
    })
    .state('declaration.show', {
      url: '/sag/:caseid',
      params: {
              searchquery: {},
              enforceSolarDelay: false
            },
      views: {
        'content@': {
          templateUrl: 'app/src/declaration/view/declaration.html',
          controller: 'DeclarationController',
          controllerAs: 'vm'
        },
      },
      redirectTo: 'declaration.show.patientdata'
    })
      .state('declaration.show.documents', {
        url: '/dokumenter',
        params: {
          path: "/Sites/retspsyk/documentLibary",
          breadcrumbPath: [],
          tmpNodeRef: null,
          emailPayload : {},
          selectedFiles : {},
          init : false,
          selectedDefaultBody : {}


        },
        views: {
          'declarations': {
            templateUrl: 'app/src/declaration/view/documents.html',
            controller: 'DeclarationDocumentController',
            controllerAs: 'vm'
          }
        }
      })
      .state('declaration.show.psyc', {
        url: '/psyc',
        params: {
          caseData: {}
        },
        views: {
          'declarations': {
            templateUrl: 'app/src/declaration/view/psyc/info.html',
            controller: 'DeclarationPsycController',
            controllerAs: 'vm'
          }
        }
  })
    .state('declaration.show.patientdata', {
      url: '/patientdata',
      params: {
        caseData: {}
      },
      views: {
        'declarations': {
          templateUrl: 'app/src/declaration/view/info-cards.html',
          controller: 'PatientInfoController',
          controllerAs: 'vm'
        }
      }
    });
}
