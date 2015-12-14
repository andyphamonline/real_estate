var TOKEN_STORAGE = "secret-token"

angular.module("RealEstateServices", ["ngResource"])
	.factory("RealEstateFactory", ["$resource", function($resource) {
		return $resource("http://localhost:3000/api/properties/:id")
	}])
	.factory("Auth", ["$window", function($window) {
		return {			
			saveToken: function(token) {
				$window.localStorage[TOKEN_STORAGE] = token;
			},
			getToken: function() {
				return $window.localStorage[TOKEN_STORAGE];
			},
			removeToken: function() {
				$window.localStorage.removeItem(TOKEN_STORAGE);
			},
			isLoggedin: function() {
				var token = this.getToken();
				console.log(token);
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
				return config;			}
		}
	}])