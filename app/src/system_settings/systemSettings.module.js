'use strict';

angular
  .module('openDeskApp.systemsettings', ['openDeskApp.filebrowser'])
  .config(config);

function config($stateProvider, USER_ROLES) {

  $stateProvider.state('administration', {
    parent: 'site',
    url: '/administration',
    views: {
      'content@': {
        templateUrl: 'app/src/system_settings/system_settings.html',
        controller: 'SystemSettingsController',
        controllerAs: 'vm'
      }
    },
    params: {
      authorizedRoles: [USER_ROLES.admin, USER_ROLES.roleManager, USER_ROLES.propertyValueManager, USER_ROLES.templateFolderValueManager]
    },
    redirectTo: 'administration.dashboard'
  })
    .state('administration.dashboard', {
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/dashboard/view/dashboard.html',
        }
      }
    })
    .state('administration.practitioners', {
      url: '/brugerrettigheder',
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/practitioners/view/practitioner-list.html',
          controller: 'PractitionerController',
          controllerAs: 'vm'
        }
      },
      params: {
        authorizedRoles: [USER_ROLES.roleManager],
        searchquery : undefined,
        onlyActive : undefined
      }
    })
      .state('administration.document_templates', {
        url: '/dokumentskabeloner',
        params: {
          authorizedRoles: [USER_ROLES.templateFolderValueManager],
          path: "/Sites/retspsyk/documentTemplates",
          breadcrumbPath: []
        },
        views: {
          'systemsetting-view': {
            templateUrl: 'app/src/system_settings/documentTemplate/documentTemplate.html',
            controller: 'DocumentTemplateController as vm'
          }
        }
      })
      .state('administration.reports', {
        url: '/reports',
        params: {
          authorizedRoles: [USER_ROLES.templateFolderValueManager],
          path: "/Sites/retspsyk/reports",
          breadcrumbPath: []
        },
        views: {
          'systemsetting-view': {
            templateUrl: 'app/src/system_settings/reports/reports.html',
            controller: 'ReportsController as vm'
          }
        }
    }).state('administration.deleteobs', {
    url: '/deleteobs',
    params: {
      authorizedRoles: [USER_ROLES.templateFolderValueManager],
      path: "/Sites/retspsyk/deleteobs",
      breadcrumbPath: []
    },
    views: {
      'systemsetting-view': {
        templateUrl: 'app/src/system_settings/deleteobs/deleteobs.html',
        controller: 'DeleteobsController as vm'
      }
    }
    }).state('administration.psyckeywords', {
    url: '/psyckeywords',
    params: {
      authorizedRoles: [USER_ROLES.templateFolderValueManager],
      path: "/Sites/retspsyk/psyckeywords",
      breadcrumbPath: []
    },
    views: {
      'systemsetting-view': {
        templateUrl: 'app/src/system_settings/psyckeywords/psyckeywords.html',
        controller: 'PsyckeywordsController as vm'
      }
    }
  }) .state('administration.forceunlock', {
    url: '/forceunlock',
    params: {
      authorizedRoles: [USER_ROLES.templateFolderValueManager],
      path: "/Sites/retspsyk/forceunlock",
      breadcrumbPath: []
    },
    views: {
      'systemsetting-view': {
        templateUrl: 'app/src/system_settings/forceunlock/forceunlock.html',
        controller: 'ForceunlockController as vm'
      }
    }
  })
    .state('administration.ethnicities', {
      url: '/etniciteter',
      params: {
        listTitle: 'Etnicitet',
        listData: 'ethnicity',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      },
    })
    .state('administration.sanctions', {
      url: '/sanktioner',
      params: {
        listTitle: 'Sanktion',
        listData: 'sanctionProposal',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      },
    })
    .state('administration.referingAgencies', {
      url: '/henvisende-instanser',
      params: {
        listTitle: 'Henvisende instans',
        listData: 'referingAgency',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      },
    })
    .state('administration.placement', {
      url: '/placeringer',
      params: {
        listTitle: 'Placering',
        listData: 'placement',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    })
    .state('administration.diagnosis', {
      url: '/diagnoser',
      params: {
        listTitle: 'Diagnose',
        listData: 'diagnosis',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    })
    .state('administration.mainCharge', {
      url: '/sigtelser',
      params: {
        listTitle: 'Sigtelse',
        listData: 'mainCharge',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    })
    .state('administration.status', {
      url: '/status',
      params: {
        listTitle: 'Status',
        listData: 'status',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    })
    .state('administration.noDeclaration', {
      url: '/afsluttet-uden-erklaering',
      params: {
        listTitle: 'Årsag',
        listData: 'noDeclarationReason',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    })
    .state('administration.doctors', {
      url: '/laeger',
      params: {
        listTitle: 'Læge',
        listData: 'doctor',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    }).state('administration.socialworkers', {
      url: '/socialraadgivere',
      params: {
        listTitle: 'Socialrådgiver',
        listData: 'socialworker',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    })
    .state('administration.psychologists', {
      url: '/psykologer',
      params: {
        listTitle: 'Psykolog',
        listData: 'psychologist',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    })
    .state('administration.secretaries', {
      url: '/sekretaerer',
      params: {
        listTitle: 'Sekretær',
        listData: 'secretary',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    })
    .state('administration.emailAuthorities', {
      url: '/myndigheder',
      params: {
        listTitle: 'Myndighed',
        listData: 'emailAuthorities',
        authorizedRoles: [USER_ROLES.propertyValueManager]
      },
      views: {
        'systemsetting-view': {
          templateUrl: 'app/src/system_settings/lists/view/list.html',
          controller: 'ListController',
          controllerAs: 'vm'
        }
      }
    });
}
