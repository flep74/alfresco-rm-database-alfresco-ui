'use strict';

angular.module('openDeskApp.site', ['ngMaterial', 'fixed.table.header'])
        .config(config)
        .run(function ($rootScope, $transitions, $state) {
            $transitions.onSuccess({to:'project'}, function (transition) {
                $state.go('project.filebrowser', { path: '' });
            });
        });


function config($stateProvider, USER_ROLES) {

    $stateProvider.state('project', {
        parent: 'site',
        url: '/projekter/:projekt',
        views: {
            'content@': {
                templateUrl: 'app/src/sites/view/site.html',
                controller: 'SiteController',
                controllerAs: 'vm'
            },
        },
        params: {
            authorizedRoles: [USER_ROLES.user]
        }

    })
    .state('project.filebrowser', {
        url: '/dokumenter{path:.*}',
        views: {
            'filebrowser': {
                templateUrl: 'app/src/sites/view/filebrowser.html',
                controller: 'SiteController',
                controllerAs: 'vm'
            }
        },
        params: {
            authorizedRoles: [USER_ROLES.user]
        },
        data: {
            selectedTab: 0
        }
    }).state('project.discussions', {
        url: '/diskussioner',
        data: {
            selectedTab: 1
        },
        views: {
            'discussions': {
                templateUrl: 'app/src/odDiscussion/view/overview.html',
                controller: 'DiscussionController',
                controllerAs: 'dc'
            }
        }
    })
    .state('project.viewthread', {
        url: '/diskussioner/{path:.*}',
        data: {
            selectedTab: 1
        },
        views: {
            'discussions': {
                templateUrl: 'app/src/odDiscussion/view/conversation.html',
                controller: 'DiscussionController',
                controllerAs: 'dc'
            }
        }
    })
    ;

};