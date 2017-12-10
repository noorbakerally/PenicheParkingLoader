angular.module('myApp').controller('myCtrl', function($timeout,$rootScope,$scope,$http,$route,getDataService,getDataService1) {

       
    
    $scope.home = true;
    $scope.allowedContentType = ["application/json","text/turtle"]
    $scope.loading = false;
    $scope.rdfGraphURL = "http://opensensingcity.emse.fr/data/data/static-rdf/nantes/nantes.parking.ttl";

    $scope.distance = false;
    $scope.address = "Saint Etienne";

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    $scope.setParkingDistance = function (){
        for (var i in $scope.parkings) {
            var parking = $scope.parkings[i];
            parking.distance = getDistanceFromLatLonInKm(parking.geoLat,parking.geoLong,$scope.lat,$scope.long)
        }
        

    };

    $scope.loadAddress = function (){
        var geocoder = new google.maps.Geocoder();
        var address = $scope.address;
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            $scope.lat = latitude;
            $scope.long = longitude;
            $scope.distance = true;
            $scope.setParkingDistance();
            
            $scope.$apply();
          } 
        }); 


    };

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
    $scope.load = function (){
        $scope.loading = true;
        getDataService.getData($scope.rdfGraphURL).then(function(result) {
            $scope.loading = false;
            $scope.test = "test";
            $scope.parkings = result;
            $scope.setParkingDistance();
        }, function(){
            
        });
    }






});
