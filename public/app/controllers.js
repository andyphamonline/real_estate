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
					// console.log("***** MainCtrl***");
					// console.log($window.localStorage["user.id"]);
					$location.path("/users/" + $window.localStorage["user.id"]) //redirects to the root path
				}, function error(res) {
					console.log(res.data);
				});
			}
	}])
	.controller("UserCtrl", [
		"$scope", "UserFactory", "$routeParams",
		function($scope, UserFactory, $routeParams) {
			UserFactory.get({id: $routeParams.id}, function(data) {
				console.log(data);
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
				password: ""
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
		function($scope, Auth, $http, $location, PropertyFactory) {
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
				$scope.results = res;
				console.log($scope.results);
				$location.path("/")
			}, function error(res) {
				console.log(res.data);
			})



			// $http.get("/api/search/", {params: {"address": address, "citystatezip": city}})
			// .then(function success(res) {
			// 	console.log(res);
			// 	$location.path("/results")
			// }, function error(res) {
			// 	console.log(res.data);
			// })
		}
	}])
