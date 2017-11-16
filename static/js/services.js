angular.module('myApp').factory('getDataService', ['$q','$http', function($q,$http) {
    return {
        getData: function (iri) {
            var deferred = $q.defer();
            var url = "/parkingloader/getResource?url="+iri;
            $http.get(url).then(function(response) {deferred.resolve(response.data);});
            return deferred.promise;
        }
    };
}]);
