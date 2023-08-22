angular
    .module('openDeskApp.lool')
    .factory('loolService', loolService);


function loolService($http, transformRequestAsFormPost, ALFRESCO_URI) {

    return {
        getWopiUrl: getWopiUrl,
        getIframeSrc: getIframeSrc,
        getLoolServiceUrl: getLoolServiceUrl,
        markDocumentAsEditing: markDocumentAsEditing,
        markDocumentAsNotEditing: markDocumentAsNotEditing,
        getState: getState
    };

    //Just in case this is set. Call the server and see if the service url is set get around proxy issues
    function getLoolServiceUrl() {
        return $http.get('/lool/host/url')
            .then(function (response) {
                return response.data.lool_host_url;
            })
            .catch(function (response) {
                console.log('WARNING: Unable to get service url for the alfresco backend. Attempt returned with:\n' +
                    response + '\nResorting to using the set default:' + ALFRESCO_URI.serviceAccessUrl);
                return ALFRESCO_URI.serviceAccessUrl;
            })

    }

    function getWopiUrl(nodeRef) {
        //var encNodeRef = encodeURIComponent(nodeRef);
        var encNodeRef = encodeURIComponent(nodeRef);
        return $http.get('/lool/token?nodeRef=' + nodeRef + '&action=edit')
            .then(function (response) {
                return response.data;
            })
    }

     function markDocumentAsEditing(nodeRef) {
        return $http.post("/alfresco/s/contents/markedforedit", {
          "nodeRef": nodeRef, "method" : "add"
        }).then(function (response) {

    //      var res = formatCase(response.data);
    //      return res;
        });
        }

     function markDocumentAsNotEditing(nodeRef) {
        return $http.post("/alfresco/s/contents/markedforedit", {
          "nodeRef": nodeRef, "method" : "remove"
        }).then(function (response) {
        });
      }


    /**
     * Currently not in use. The idea of this was to submit a (form) request to the libreoffice online service and
     * collect the return for use in the iFrame ro render the Loleaflet client.
     * @param frameSrcURL
     * @param access_token
     * @returns {*}
     */
    function getIframeSrc(frameSrcURL, access_token) {
        return $http({
            method: 'POST',
            url: frameSrcURL,
            transformRequest: transformRequestAsFormPost,
            data: {access_token: access_token},
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Sec-Fetch-Site": "none",
                "x-requested-with": ''
            }
        }).then(
            function (response) {
                // How to return this for an iframe
                return response;
            },
            function (response) {
                // Error
                return response;
            }
        );
    }

     function getState(nodeRef) {
            return $http.post("/alfresco/s/contents/markedforedit", {
              "nodeRef": nodeRef, "method" : "state"
            }).then(function (response) {
                return response.data.state;
            });
          }


}
