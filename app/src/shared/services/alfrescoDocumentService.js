angular
    .module('openDeskApp')
    .factory('alfrescoDocumentService', AlfrescoDocumentService);

function AlfrescoDocumentService($http, alfrescoNodeUtils) {

    var service = {
        retrieveSingleDocument: retrieveSingleDocument,
        retrieveNodeInfo: retrieveNodeInfo
    };
    return service;

    function retrieveSingleDocument(nodeRef) {
        var params = "?view=browse&noCache=" + new Date().getTime() + "&includeThumbnails=true";
        var url = "/slingshot/doclib2/node/" + alfrescoNodeUtils.processNodeRef(nodeRef).uri + params;
        return $http.get(url).then(function (result) {

            var docName = result.data.item.node.properties["cm:name"];


// todo -
//fejlen er herunden

console.log("docName.split");
console.log("docName.split");
console.log(docName.split("."));

            // bugfix

            var bugfixCount = docName.split(".");
            console.log("bugfixCount");
            console.log(bugfixCount.length);


            if (bugfixCount.length == 3) {
                // take care of the converted pdfs with the .odt in the filename
                if (docName.split(".")[2] == "odt") {
                    return getPreview(result.data.item.node.nodeRef, params);
                }
                else {
                    return result.data.item;
                }
            }
            else {
                if (docName.split(".")[1] == "odt") {
                    console.log("er jeg her...")
                    return getPreview(result.data.item.node.nodeRef, params);
                }
                else {
                    return result.data.item;
                }
            }


        });
    }

    function retrieveNodeInfo(nodeRef) {
        var url = '/alfresco/s/filebrowser?method=getAll&NODE_ID=' + alfrescoNodeUtils.processNodeRef(nodeRef).id + '&STORE_TYPE=workspace&STORE_ID=SpacesStore';
        return $http.get(url).then(function (response) {
            return response.data;
        });
    }

    function getPreview(nodeRef, params) {
        return $http.post("/alfresco/s/contents/transformodt", {"nodeRef" : alfrescoNodeUtils.processNodeRef(nodeRef).id}).then(function (response) {
            var url = "/slingshot/doclib2/node/" + alfrescoNodeUtils.processNodeRef("workspace://SpacesStore/" + response.data.item).uri + params;
            return $http.get(url).then(function (fin) {
                return fin.data.item;
            });
        });
    }

}
