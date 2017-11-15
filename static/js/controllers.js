angular.module('myApp').controller('myCtrl', function($timeout,$rootScope,$scope,$http,$route,getDataService,getDataService1) {

    $scope.home = true;
    $scope.allowedContentType = ["application/json","text/turtle"]
    $scope.loading = false;
    $scope.isAllowedContentType = function (contenType) {
        if ($scope.allowedContentType.indexOf(contenType) != -1) {
            return true;
        }
        return false;
    };

    //initializing the tree
    $scope.treeNodes =[];
    $scope.options = {
        expandOnClick:true,
        showIcon: true,
    };

    $scope.showHome = function (){
        $scope.home = true;
        $scope.loading = false;
        $scope.configuration = false;
    };

    $scope.showConfigurations = function (){
        $scope.home = false;
        $scope.loading = false;
        $scope.configuration = true;
    };

    

    $scope.load = function (){
        $scope.home = false;
        $scope.loading = false;
        $scope.configuration = false;
        
        node = {};
        node.iri = $scope.rootContainer; 
        $scope.loading =true;
        getDataService.getData(node).then(function(result) {
            $scope.loading =false;
            $scope.treeNodes = [];
            $scope.treeNodes.push(result);
        }, function(){
            
        });
    }

    //on node change handler
    $scope.$on('selection-changed', function (e, node) {
        $scope.selectedNode = node;
        if (node.fetch == 1) {return;}
        $scope.loading = true;
        getDataService.getData(node).then(function(result) {
            $scope.loading = false;
            updateNode($scope.selectedNode,result)
            
            $scope.selectedNode.fetch = 1;
        }, function(){
            
        });
        
    });

    $scope.$on('expanded-state-changed', function (e, node) {
        $scope.selectedNode = node;
        if(node.expanded){
            $scope.selectedNode.image = "static/lib/tree-widget/img/folder-open.png";
        } else {
            $scope.selectedNode.image = "static/lib/tree-widget/img/folder-closed.png";
        }
    });
    
    updateNode = function (oldObject,newObject){
        oldObject.children = newObject.children;
        oldObject.data = newObject.data;
        console.log(newObject.type);
        if (newObject.type.indexOf("Container") == -1){
            if (newObject.type.indexOf("RDFSource") != -1){
                oldObject.image = "static/lib/tree-widget/img/RDFSource.png";
            } else {
                oldObject.image = "static/lib/tree-widget/img/NonRDFSource.png";
            }
        }
        

        oldObject.type = newObject.type.join();
        oldObject.contentType = newObject.contentType;
    };

});
