var TOKEN_STORAGE = "secret-token"

angular.module("RealEstateServices", ["ngResource"])
	.factory("PropertyFactory", ["$resource", function($resource) {
		return $resource("http://localhost:3000/api/search");
	}])
	.factory("UserFactory", ["$resource", function($resource) {
		return $resource("http://localhost:3000/api/users/:id");
	}])
	.factory("Auth", ["$window", function($window) {
		return {			
			saveToken: function(token, user) {
				$window.localStorage[TOKEN_STORAGE] = token;
				$window.localStorage["user.id"] = user.id;
				$window.localStorage["user.name"] = user.name;
				console.log($window.localStorage["user.name"]);
			},
			getToken: function() {
				return $window.localStorage[TOKEN_STORAGE];
			},
			removeToken: function() {
				$window.localStorage.removeItem(TOKEN_STORAGE);
			},
			isLoggedin: function() {
				var token = this.getToken();
				return token ? true : false;
			}
		}
	}])
	.factory("AuthInterceptor", ["Auth", function(Auth) {
		return {
			request: function(config) {
				var token = Auth.getToken();
				if (token) {
					config.headers.Authorization = "Bearer" + token;
				}
				return config;			
			}
		}
	}])