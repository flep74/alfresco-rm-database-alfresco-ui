'use strict';

angular
  .module('openDeskApp.declaration')
  .factory('DeclarationPsycService', DeclarationPsycService);

function DeclarationPsycService($http, $filter) {

  var currentCase = {};

  var service = {
    test2 : test2,
    getInstruments : getInstruments,
    getOverViewData : getOverViewData,
    getDetailViewData : getDetailViewData,
    getAdvancedSearchInstrument : getAdvancedSearchInstrument,
    saveDetailViewData : saveDetailViewData,
    saveKonklusionText : saveKonklusionText,
    getKonklusionText : getKonklusionText
  };

  return service;

  function formatCase(res) {
    angular.forEach(res, function (value, key) {
      if (value == 'null') {
        delete res[key];
      }
    });

    return res;
  }

  function test2() {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties": {"method" : "test", "gaf" : "kat"}
    }).then(function (response) {
      return response.data;
    });
  }

  function getInstruments(caseNumber) {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties" : {"method" : "getInstruments", "caseid" : caseNumber}
    }).then(function (response) {
        return response.data;
      });
  }

  function getOverViewData(caseNumber) {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties" : {"method" : "getInstrumentsForOverview", "caseid" : caseNumber}
    }).then(function (response) {
      return response.data;
    });
  }

  function getDetailViewData(caseNumber, instrument) {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties" : {"method" : "getInstrumentsForDetailview", "caseid" : caseNumber, "instrument" : instrument}
    }).then(function (response) {
      return response.data;
    });
  }

  function getAdvancedSearchInstrument(instrument) {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties" : {"method" : "getInstrumentsForAdvancedSearch", "instrument" : instrument}
    }).then(function (response) {
      return response.data;
    });
  }

  function saveDetailViewData(caseNumber, instrument, selected) {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties" : {"method" : "saveInstrumentsForDetailview", "caseid" : caseNumber, "instrument" : instrument, "selected" : selected}
    }).then(function (response) {
      return response.data;
    });
  }

  function saveKonklusionText(caseNumber, text) {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties" : {"method" : "saveKonklusionText", "caseid" : caseNumber, "newValue" : text}
    }).then(function (response) {
      return response.data;
    });
  }

  function getKonklusionText(caseNumber) {
    return $http.post("/alfresco/s/database/retspsyk/psyc", {
      "properties" : {"method" : "getKonklusionText", "caseid" : caseNumber}
    }).then(function (response) {

      console.log("har jeg fået en værdi tilbage som kan bruges?")
      console.log(response)

      return response.data;
    });
  }







}
