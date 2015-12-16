var TOKEN_STORAGE = "secret-token"

angular.module("RealEstateServices", ["ngResource"])
	.factory("PropertyFactory", ["$resource", function($resource) {
		return $resource("http://localhost:3000/api/properties/:id", null, {'update': { method:'PUT'}});
	}])
	.factory("UserFactory", ["$resource", function($resource) {
		return $resource("http://localhost:3000/api/users/:id", null, {"update": {method: "PUT"}});
	}])
	.factory("Auth", ["$window", function($window) {
		return {			
			saveToken: function(token, user) {
				$window.localStorage[TOKEN_STORAGE] = token;
				$window.localStorage["user.id"] = user.id;
				$window.localStorage["user.name"] = user.name;							
			},
			getToken: function() {
				return $window.localStorage[TOKEN_STORAGE];
			},
			removeToken: function() {
				$window.localStorage.removeItem(TOKEN_STORAGE);
				$window.localStorage.removeItem(["user.id"]);
				$window.localStorage.removeItem(["user.name"]);
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