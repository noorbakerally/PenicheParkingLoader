angular.module('myApp').config(function($routeProvider) {
  $routeProvider
  .when("/", {
    
  })
  .when("/red", {
	 template : "<h1>Main</h1><p>Click on the links to change this content</p>"
  })
  .when("/green", {
    templateUrl : "green.htm"
  })
  .when("/blue", {
    templateUrl : "blue.htm"
  });
});
