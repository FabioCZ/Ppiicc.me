// lol factory

picmeApp.factory('pictureService', function($http) {
	var pictureService = {
		getPicture: function() {
			// $http returns a promise, which has a then function, which also returns a promise
			var promise = $http.get('api/images')
			
			.then(function (response)
			{
				// The return value gets picked up by the then in the controller.
				return response.data;
			});
			// Return the promise to the controller
			return promise;
		},
		
		likePicture: function(pictureId) {
			var promise = $http({
				method: "post",
				url: "/api/images/like",
				data: {
					id: pictureId,
					vote: ""
				}
			})
			
			.then(function (response)
			{
				return response.data;
			})
			.error(function(error){
				return error.data;
			})
			
			return promise;
		}
	};
	
	return pictureService;
});