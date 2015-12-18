angular.module("RealEstateCtrls", ["RealEstateServices", "flash"])
	.controller("MainCtrl", [
		"$scope",
		"$http",
		"$location",
		"Auth",
		"$window",
		"Flash",
		"$rootScope",
		function($scope, $http, $location, Auth, $window, Flash, $rootScope) {
			$scope.dangerAlert = function() {
				Flash.create("danger", "Incorrect email or password");
			}
			$scope.user = {
				email: "",
				password: ""
			};

			$scope.userAction = function() {
				$http.post("/api/auth", $scope.user).then(function success(res) {
					if (res.data.user){
						Auth.saveToken(res.data.token, res.data.user);
						$rootScope.name = res.data.user.name;
						$rootScope.userId = res.data.user.id;						
						$location.path("/users/" + $window.localStorage["user.id"])						
					}
					else {
						$scope.dangerAlert();
					}
				}, function error(res) {
					console.log(res.data);
				});
			}
	}])
	.controller("UserCtrl", [
		"$scope", "UserFactory", "$routeParams", "UserProperty",
		function($scope, UserFactory, $routeParams, UserProperty) {
			UserFactory.get({id: $routeParams.id}, function(data) {				
				$scope.user = data
				console.log($scope.user);
			})

			$scope.properties = [];
			
			$scope.users = [];

			UserFactory.query(function(data) {
				$scope.users = data;		
				console.log($scope.users);
			}, function(data) {
				console.log(data);
			})

			UserProperty.get({id: $routeParams.id}, function success(data) {
				$scope.properties = data;
			}, function error(data) {
				console.log(data);
			});
	}])
	.controller("SignupCtrl", [
		"$scope",
		"$http",
		"$location",
		"Auth",
		"$rootScope",
		"Flash",
		function($scope, $http, $location, Auth, $rootScope, Flash) {
			$scope.user = {
				name: "",
				email: "",
				password: "",
				cash: 1000000
			};

			$scope.dangerAlert = function() {
				Flash.create("danger", "User already existed");
			}

			$scope.userAction = function() {
				$http.post("/api/users", $scope.user).then(function success(res) {
					$http.post("/api/auth", $scope.user).then(function success(res) {				
							Auth.saveToken(res.data.token, res.data.user);
							$rootScope.name = res.data.user.name;
							$rootScope.userId = res.data.user.id;
							$location.path("/users/" + window.localStorage["user.id"]);
					}, function error(res) {
						console.log(res);
					});
				}, function error(res) {
					console.log(res);
					$scope.dangerAlert();
				})
			}
		}
	])
	.controller("NavCtrl", [
		"$scope", 
		"Auth",
		"$http",
		"$location", 
		"$rootScope",
		"$window",
		"Flash",
		function($scope, Auth, $http, $location, $rootScope, $window, Flash) {
			$scope.dangerAlert = function() {
				Flash.create("danger", "No Search Match. Please use a different address");
			}

			$scope.logout = function() {
				Auth.removeToken();
				$rootScope.user = null;
				$location.path("/");
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
					if (res.data.length === 0) {						
						$scope.dangerAlert();						
					}
					else {						
						$rootScope.searchResults = res;
						$rootScope.$emit("search_update");
						$location.path("/results");
					}					
				}, function error(res) {
					console.log("res in error: ", res);
				})
			}

			//check if $rootScope & login
			if ( $rootScope.isLoggedIn() && $window.localStorage["user.name"] ) {
				$scope.name = $window.localStorage["user.name"];
				$scope.userId = $window.localStorage["user.id"];
			} else if ($rootScope.isLoggedIn()) {
				$scope.name = $rootScope.user.name;
				$scope.userId = $rootScope.user.id;
			}
	}])
	.controller("ResultsCtrl", [
		"$scope",
		"$rootScope",
		"$window",
		"$location",
		"PropertyFactory",
		"UserFactory",
		function($scope, $rootScope, $window, $location, PropertyFactory, UserFactory) {
			$scope.userId = $window.localStorage["user.id"];
			$scope.results = $rootScope.searchResults.data;
			$rootScope.$on("search_update", function() {
				$scope.results = $rootScope.searchResults.data;
			});
			
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
				
				// update user cash in DB
				UserFactory.get({id: $window.localStorage["user.id"]}).$promise.then(function(result){
					if (result.cash > $scope.property.price) {
						result.cash = result.cash - $scope.property.price
						UserFactory.update({id: $window.localStorage["user.id"]}, {cash: result.cash});	
						PropertyFactory.save($scope.property, function success(data) {
							$location.path("/properties/" +  data.id);
						}, function error(data) {
							console.log(data);
						});					
					}
					else {
						alert("You don't have enough money. Please search again!")
					}
				});

			}
	}])
	.controller("PropertyShowCtrl", [
		"$scope",
		"PropertyFactory",
		"$routeParams",
		"UserFactory",
		"$location",
		"$window",
		"Flash",
		function($scope, PropertyFactory, $routeParams, UserFactory, $location, $window, Flash) {
			eventArray = [
				{"Carl moved to the neighborhood": 5},
				{"Thomas moved next to your house": 6},
				{"Amazon moved to Texas": 10},
				{"Crime rate went up in your area": 7},
				{"Boeing moved to Texas": 8},
				{"Your tenants destroyed your house": 9},
				{"You upgraded your kitchen to granite": 10},
				{"An investor wanted to buy your neighborhood": 9},
				{"There's a shortage of housing supply": 8},
				{"Boeing opens 3 more plants": 7},
				{"Population hit record level": 6},
				{"Fed dropped interest rate to 0": 5},
				{"Disneyland opened a park in your neighborhood ": 6},
				{"Batman bought a house in your area": 7},
				{"Netflix moved their headquater": 8},
				{"Queen Elizabeth moved to Seattle": 9},
				{"Seattle Seahawks built a stadium in your area": 9},
				{"Your spouse upgraded the roof": 8},
				{"You built an extra bedroom": 7},
				{"You added a solar-powered water heater": 6},
				{"You painted your house": 5},
				{"You cleaned your house the 1st time in 3 years": 6}							
			]

			$scope.property = PropertyFactory.get({id: $routeParams.id});

			$scope.createEvent = function() {
				var index = Math.floor(Math.random()*eventArray.length);
				var singleEvent = eventArray[index];
				for (key in singleEvent) {
				}								
				if (index < 6) {
					$scope.property.price = Math.round($scope.property.price - (($scope.property.price * singleEvent[key])/100));
					console.log("price bad: ", $scope.property.price);					
					Flash.create("success", key + " .Your house decreased by " + singleEvent[key] + "% .The new value of your house is: $" + $scope.property.price);
				}
				else {
					$scope.property.price = Math.round($scope.property.price + (($scope.property.price * singleEvent[key]/100)));
					Flash.create("success", key + " .Your house increased by " + singleEvent[key] + "% .The new value of your house is: $" + $scope.property.price);
				}

				PropertyFactory.update({id: $routeParams.id}, $scope.property)
			}

			$scope.properties = [];

			$scope.deleteProperty = function(id, propertyIdx) {
				//add property sold price to user cash
				UserFactory.get({id: $window.localStorage["user.id"]}).$promise.then(function(result){				
					result.cash = result.cash + $scope.property.price;
					UserFactory.update({id: $window.localStorage["user.id"]}, {cash: result.cash});						
				});

				PropertyFactory.delete({id: $routeParams.id}, function success(data) {
					$scope.properties.splice(propertyIdx, 1);
					$location.path("/users/" + $window.localStorage["user.id"]);
				}, function error(data) {
					console.log(data);
				});
			}
	}])















