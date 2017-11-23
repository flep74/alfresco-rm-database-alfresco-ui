angular
    .module('openDeskApp.init', ['ngMaterial'])
    .constant('USER_ROLES', {
        admin: 'admin',
        user: 'user',
        roleManager: 'SiteRoleManager',
        entryLockManager: 'SiteEntryLockManager',
        propertyValueManager: 'SitePropertyValueManager',
        templateFolderValueManager: 'TemplateFolderValueManager'
        //guest: 'guest' we don't want this type of user as of yet
    })
    .constant('ALFRESCO_URI', {
        apiProxy: '/alfresco/api/',
        serviceApiProxy: '/api/',
        serviceSlingshotProxy: '/slingshot/',
        serviceAccessUrl: 'https://staging.opendesk.dk/alfresco/s',
        webClientServiceProxy: '/alfresco/service'
    })
    .constant('PATTERNS', {
        fileName: /^[a-zA-Z0-9_\-,!@#$%^&()=+ ]+$/,
        phone: /^[+]?[0-9\- ]+$/
    })
    .constant('APP_CONFIG', {
        appName: 'Retspsykiatriske erklæringer',
        logoSrc: './app/assets/images/logo-light.svg',
        ssoLoginEnabled: "false",
        landingPage: "declaration"
    });