angular.module('myApp').factory('getDataService', ['$q','$http', function($q,$http) {
    return {
        getData: function (node) {
            var deferred = $q.defer();
            var url = "getResource?ldpr="+node.iri;
            $http.get(url).then(function(response) {deferred.resolve(response.data);});
            return deferred.promise;
        }
    };
}]);


angular.module('myApp').factory('getDataService1', function($http,$q) {
       return {
         getData: function() {
           var deferred = $q.defer();
           var url = "http://127.0.0.1:5000/getResource?callback=JSON_CALLBACK&ldpr="+"http://localhost:8080/marmotta/ldp";
  
         $http.get(url).success(function (data, status, headers, config) {
                console.log(data);
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                //this always gets called
                console.log(status);
                deferred.reject(status);
            });
            return deferred.promise;
     }  }
 });