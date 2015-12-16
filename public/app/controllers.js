angular.module("RealEstateCtrls", ["RealEstateServices"])
	.controller("MainCtrl", [
		"$scope",
		"$http",
		"$location",
		"Auth",
		"$window",
		function($scope, $http, $location, Auth, $window) {
			$scope.user = {
				email: "",
				password: ""
			};

			$scope.userAction = function() {
				$http.post("/api/auth", $scope.user).then(function success(res) {
					Auth.saveToken(res.data.token, res.data.user);					
					$location.path("/users/" + $window.localStorage["user.id"])
				}, function error(res) {
					console.log(res.data);
				});
			}
	}])
	.controller("UserCtrl", [
		"$scope", "UserFactory", "$routeParams",
		function($scope, UserFactory, $routeParams) {
			UserFactory.get({id: $routeParams.id}, function(data) {				
				$scope.user = data
			}, function(data) {
				console.log(data)
			})
	}])
	.controller("SignupCtrl", [
		"$scope",
		"$http",
		"$location",
		"Auth",
		function($scope, $http, $location, Auth) {
			$scope.user = {
				name: "",
				email: "",
				password: "",
				cash: 1000000
			};
			$scope.userAction = function() {
				$http.post("/api/users", $scope.user).then(function success(res) {
					$http.post("/api/auth", $scope.user).then(function success(res) {
						Auth.saveToken(res.data.token, res.data.user);
						$location.path("/users/" + window.localStorage["user.id"])
					}, function error(res) {
						console.log(res.data);
					});
				})
			}
		}
	])
	.controller("NavCtrl", [
		"$scope", 
		"Auth",
		"$http",
		"$location", 
		"PropertyFactory",
		"$rootScope",
		"$window",
		function($scope, Auth, $http, $location, PropertyFactory, $rootScope, $window) {
		$scope.name = $window.localStorage["user.name"];
		$scope.userId = $window.localStorage["user.id"];
		$scope.logout = function() {
			Auth.removeToken();
			$location.path("/");
			console.log("logout");
		}
		$scope.search = {
			q: ""
		}
		$scope.searchAction = function(address, city) {
			var x = address.replace(/\s/g, "+");
			var y = city.replace(/\s/g, "+");
			$http({
				url: "api/search",
				method: "GET",
				params: {address: x, citystatezip: y}
			})
			.then(function success(res) {
				$rootScope.searchResults = res;
				$rootScope.$emit("search_update");
				$location.path("/results");
			}, function error(res) {
				console.log(res.data);
			})
		}
	}])
	.controller("ResultsCtrl", [
		"$scope",
		"$rootScope",
		"$window",
		"$location",
		"PropertyFactory",
		function($scope, $rootScope, $window, $location, PropertyFactory) {
			$scope.userId = $window.localStorage["user.id"];
			$scope.results = $rootScope.searchResults.data;
			$rootScope.$on("search_update", function() {
				$scope.results = $rootScope.searchResults.data;
			});
			// $rootScope.searchResults = {};
			
			$scope.createProperty = function(result) {
				$scope.property = {
					zpid: result.zpid[0],
					address: result.address[0].street[0],
					city: result.address[0].city[0],
					state: result.address[0].state[0],
					zip: result.address[0].zipcode[0],
					price: result.zestimate[0].amount[0]._,
					yearBuilt: result.yearBuilt[0],
					lotSize: result.lotSizeSqFt[0],
					bedrooms: result.bedrooms[0],
					bathrooms: result.bathrooms[0],
					lastSoldPrice: result.lastSoldPrice[0]._,
					user: $window.localStorage["user.id"]
				};
				PropertyFactory.save($scope.property, function success(data) {
					$location.path("/properties/" +  data.id);
					// console.log("****************** HELLO", data);
				}, function error(data) {
					console.log(data);
				});
			}
	}])
	.controller("PropertyCtrl", [
		"$scope", 
		"PropertyFactory",
		function($scope, PropertyFactory) {
			$scope.properties = [];
			console.log("outside $scope.properties", $scope.properties);

			PropertyFactory.query(function success(data) {
				$scope.properties = data;
				console.log("************** inside $scope.properties", $scope.properties)
			}, function error(data) {
				console.log("************** error", data);
			});

			$scope.deleteProperty = function(id, propertyIdx) {
				Property.delete({id: id}, function success(data) {
					$scope.properties.splice(propertyIdx, 1);
				}, function error(data) {
					console.log("************** $error", data);
				});
			}
	}])
	.controller("PropertyShowCtrl", [
		"$scope",
		"PropertyFactory",
		"$routeParams",
		function($scope, PropertyFactory, $routeParams) {
			PropertyFactory.get({id: $routeParams.id}, function(data) {
				console.log(data);
				$scope.property = data;
				console.log("************HELLO", data);
			}, function(data) {
				console.log(data);
			}
		)
	}])



	// .controller("ResultShowCtrl", [
	// 	"$scope",
	// 	"$routeParams",
	// 	function($scope,$routeParams) {
	// 		console.log($routeParams.id);
	// }])

















