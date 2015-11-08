picmeServices.factory('userService', function ($http) {
    var apihost = "http://104.236.184.113:3000/api/";

    var user = null;
    
    var userService = {
        getUser: function (userId) {

            
            var promise = $http.get(apihost + "user/" + userId)

			.then(function (response) {
			    user = response.data;
			    console.log(response.data);
			    return response.data;
			})

            return promise;
            
        },

        getUsername: function () {
            return user.name;
        },

        hasUserData: function() {
            return user != null;
        }
    }

    return userService;
});