'use strict';

angular
  .module('openDeskApp.declaration')
  .factory('DeclarationService', DeclarationService);

function DeclarationService($http, $filter) {

  var currentCase = {};

  var service = {
    get: getEntry,
    updateStat: updateStat,
    create: createEntry,
    unlock: unlockEntry,
    update: updateEntry,
    getAutoComleteEntries: getAutoComleteEntries,
    getWaitingList: getWaitingList,
    advancedSearch: advancedSearch,
    makeDeclarationDocument: makeDeclarationDocument,
    makeBrevDocument: makeBrevDocument,
    makeBerigtigelsesDocument: makeBerigtigelsesDocument,
    makeSuppleredeUdtDocument: makeSuppleredeUdtDocument,
    getStateOfDeclaration: getStateOfDeclaration,
    undoCloseCaseEntry: undoCloseCaseEntry,
    isBUAUser: isBUAUser
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

  function isBUAUser() {
    return $http.get('/alfresco/s/usertype').then(function (response) {
      return response.data.bua;
    })
  }

  function getEntry(caseNumber) {
    return $http.get("/alfresco/s/database/retspsyk/entry/" + caseNumber)
      .then(function (response) {
        return formatCase(response.data);
      });
  }

  function getAutoComleteEntries(skip, max, input) {

    if (input.includes("#")) {
      input = input.replace("#","!");
    }
    return $http.get("/alfresco/s/database/retspsyk/autocompleteentries" + "?skip=" + skip + "&maxItems=" + max + "&input=" + input)
      .then(function (response) {
        return response.data;
      });
  }

  function advancedSearch(skip, max, query) {

    // bugfix - if no mainCharge, send an undefined instead of an empty array. The backend dosnt handle empty arrays
    let updatedQuery = JSON.parse(JSON.stringify(query));

    if (query.mainCharge != undefined && query.mainCharge.length == 0) {
      updatedQuery.mainCharge = undefined;
    }

    if (query.mainDiagnosis != undefined && query.mainDiagnosis.length == 0) {
      updatedQuery.mainDiagnosis = undefined;
    }

    if (query.placement != undefined && query.placement.length == 0) {
      updatedQuery.placement = undefined;
    }

    if (query.sanctionProposal != undefined && query.sanctionProposal.length == 0) {
      updatedQuery.sanctionProposal = undefined;
    }

    if (query.status != undefined && query.status.length == 0) {
      updatedQuery.status = undefined;
    }

    if (query.doctor != undefined && query.doctor.length == 0) {
      updatedQuery.doctor = undefined;
    }

    if (query.socialworker != undefined && query.socialworker.length == 0) {
      updatedQuery.socialworker = undefined;
    }

    if (query.supervisingDoctor != undefined && query.supervisingDoctor.length == 0) {
      updatedQuery.supervisingDoctor = undefined;
    }

    if (query.psychologist != undefined && query.psychologist.length == 0) {
      updatedQuery.psychologist = undefined;
    }

    return $http.post(`/alfresco/s/database/retspsyk/page_entries?skip=${skip}&maxItems=${max}`, updatedQuery)
      .then(response => {
        return response.data;
      });
  }

  function getWaitingList(skip, max) {
    return $http.get(`/alfresco/s/database/retspsyk/waitinglist?skip=${skip}&maxItems=${max}`)
      .then(function (response) {
        return response.data;
      });
  }

  function updateEntry(properties) {
    return $http.put("/alfresco/s/entry/" + properties['node-uuid'], {
      "properties": properties
    }).then(function (response) {
      var res = formatCase(response.data);
      return res;
    });
  }

  function createEntry(entry) {
    return $http.post("/alfresco/s/database/retspsyk/entrytest", {
      "type": "forensicPsychiatryDeclaration",
      "properties": entry.properties,
      "bua": entry.bua
    }).then(function (response) {

      var nw = new Date();
      var nwformat = $filter('date')(nw,'yyyy');

      service.updateStat(nwformat);

      return formatCase(response.data);

    });
  }

  function makeDeclarationDocument(desclaration) {

    var d;
    if (desclaration.rulingDate == undefined) {
      d = new Date();

    }
    else {
      d = new Date(desclaration.rulingDate);

    }

    var formatted_date = (d.getDate() <= 9) ? "0" + d.getDate() : d.getDate();
    var formatted_month = ( (d.getMonth()+1) <= 9) ? "0" + (d.getMonth()+1) : d.getMonth()+1;


    var dformattet = formatted_date + "." + formatted_month + "." + d.getFullYear();

    return $http.post("/alfresco/s/contents/mergedoctemplate", {
      "id": desclaration['node-uuid'],
      "type": desclaration.declarationType,
      "retten": desclaration.rulingCourt,
      "dato": dformattet
    }).then(function (response) {
      return response.data;
    });
  }

  function makeBrevDocument(desclaration) {

    return $http.post("/alfresco/s/contents/mergebrevtemplate", {
      "id": desclaration['node-uuid']
    }).then(function (response) {
      return response.data;
    });
  }


  function makeBerigtigelsesDocument(desclaration) {

    var d;
    if (desclaration.rulingDate == undefined) {
      d = new Date();

    }
    else {
      d = new Date(desclaration.rulingDate);

    }

    var formatted_date = (d.getDate() <= 9) ? "0" + d.getDate() : d.getDate();
    var formatted_month = ( (d.getMonth()+1) <= 9) ? "0" + (d.getMonth()+1) : d.getMonth()+1;


    var dformattet = formatted_date + "." + formatted_month + "." + d.getFullYear();

    return $http.post("/alfresco/s/contents/mergeberigtigelsestemplate", {
      "id": desclaration['node-uuid'],
      "type": desclaration.declarationType,
      "retten": desclaration.rulingCourt,
      "dato": dformattet
    }).then(function (response) {
      return response.data;
    });
  }

  function makeSuppleredeUdtDocument(desclaration) {

    var d;
    if (desclaration.rulingDate == undefined) {
      d = new Date();

    }
    else {
      d = new Date(desclaration.rulingDate);

    }

    var formatted_date = (d.getDate() <= 9) ? "0" + d.getDate() : d.getDate();
    var formatted_month = ( (d.getMonth()+1) <= 9) ? "0" + (d.getMonth()+1) : d.getMonth()+1;


    var dformattet = formatted_date + "." + formatted_month + "." + d.getFullYear();

    return $http.post("/alfresco/s/contents/mergesuppleredeudttemplate", {
      "id": desclaration['node-uuid'],
      "type": desclaration.declarationType,
      "retten": desclaration.rulingCourt,
      "dato": dformattet
    }).then(function (response) {
      return response.data;
    });
  }

  function unlockEntry(properties, mode) {
    return $http.put("/alfresco/s/entry/" + properties['node-uuid'] + '/unlock' + "?mode=" + mode)
      .then(function (response) {
        return response.data;
      });
  }

  function undoCloseCaseEntry(properties) {
    return $http.put("/alfresco/s/entry/" + properties['node-uuid'] + '/undoclosecaseentry')
        .then(function (response) {
          return response.data;
        });
  }

  function updateStat(year) {
    $http.post("/alfresco/s/database/retspsyk/weeklystat", {
      "method": "initYear",
      "year": year
    }).then(function (response) {
      console.log(response);
    });
  }

  function getStateOfDeclaration(casenum) {
    return $http.post("/alfresco/s/database/retspsyk/flowchart", {"properties" : {"method": "getStateOfDeclaration", "casenumber": casenum}} );
  }



}
