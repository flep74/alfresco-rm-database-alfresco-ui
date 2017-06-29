'use strict';

angular.module('openDeskApp.declaration').factory('declarationService', function ($http, $window, alfrescoNodeUtils) {

    var restBaseUrl = '/alfresco/s/api/';

    var _currentSiteType = "";

    var declarationController = null;

    var newCase = {};

    return {

        updateNewCase: function(caseUpdate) {
            newCase = caseUpdate;
        },

        getNewCaseInfo: function() {
            return newCase;
        },

        getCase : function(caseNumber) {
            return $http.get("/alfresco/s/entry?type=forensicPsychiatryDeclaration&entryKey=caseNumber&entryValue=" + caseNumber, {}).then(function (response) {
                return response.data;

            });
        },

        updateCase : function(caseNumber, properties) {
            return $http.put("/alfresco/s/entry?type=forensicPsychiatryDeclaration&entryKey=caseNumber&entryValue=" + caseNumber,
                            {"type":"forensicPsychiatryDeclaration",
                            "siteShortName" : "retspsyk",
                            "properties" : properties}).then(function (response) {

                return response.data;

            });
        },

        createCase : function(properties) {
            return $http.post("/alfresco/s/entry", {"type":"forensicPsychiatryDeclaration",
                                                    "siteShortName" : "retspsyk",
                                                    "properties" : properties}).then(function (response) {
                return response.data;

            });
        },

        getContents: function (node) {
            return $http.get("/alfresco/service/contents?node=" + node).then(function(response) {
                //console.log(response.data);
                return response.data;
            });
        }
    };
});
