var app = angular.module("RealEstateApp", ["RealEstateServices", "RealEstateCtrls", "ngRoute"]);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "app/views/main.html",
		controller: "MainCtrl"
	})
	.when("/signup", {
		templateUrl: "app/views/signup.html",
		controller: "SignupCtrl"
	})
	.when("/users/:id", {
		templateUrl: "app/views/user.html",
		controller: "UserCtrl"
	})
	.when("/results", {
		templateUrl: "app/views/results.html",
		controller: "ResultsCtrl"
	})
	.when("/results/:id", {
		templateUrl: "app/views/resultsShow.html"
	})
	.when("/properties/:id", {
		templateUrl: "app/views/propertiesShow.html"
	})
	.otherwise({
		templateUrl: "app/views/404.html"
	})

	$locationProvider.html5Mode(true);
}])
.config(["$httpProvider", function($httpProvider) {
	$httpProvider.interceptors.push("AuthInterceptor");
}])
.run(["$rootScope", "Auth", function($rootScope, Auth) {
	$rootScope.isLoggedIn = function() {
    	return Auth.isLoggedin.apply(Auth);
	}
	$rootScope.searchResults = {};

}]);
