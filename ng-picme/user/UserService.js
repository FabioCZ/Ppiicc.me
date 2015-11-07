picmeServices.factory('userService', function($http)
{
	var apihost = "http://104.236.184.113:3000/api/";

	// dummy user
	var user = {
		name: "d98c375e-ab3b-4d4b-a802-3e2aec417744",
		liked: [],
		disliked: []
	}
	
	var userService = {
		getUser: function()
		{
			var promise = $http.get(apihost + user.name)
			
			.then(function (response) {
				console.log(response.data);
				return response.data;
			})
		},
		
		getUsername: function()
		{
			return user.name;
		}
	}
	
	return userService;
});