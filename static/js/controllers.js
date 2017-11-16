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

    $scope.showHome = function (){
        $scope.home = true;
        $scope.loading = false;
        $scope.configuration = false;
    };

    $scope.rdfGraphURL = "http://opensensingcity.emse.fr/peniche/parking.nantes.ttl";

    $scope.load = function (){
        $scope.loading = true;
        getDataService.getData($scope.rdfGraphURL).then(function(result) {
            $scope.loading = false;
            $scope.test = "test";
            $scope.parkings = result;
        }, function(){
            
        });
    }


});