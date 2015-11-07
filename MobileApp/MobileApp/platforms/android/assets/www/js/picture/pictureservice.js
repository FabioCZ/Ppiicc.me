// lol factory

picmeServices.factory('pictureService', function ($http) {
    var apihost = "http://104.236.184.113:3000/api/";

    var pictureService = {

        dislikePicture: function (pictureObject, userId) {
            var promise = $http({
                method: "post",
                url: apihost + "vote/dislike/" + userId,
                data: pictureObject
            })

			.then(function (response) {
			    return response.data;
			})

			.error(function (error) {
			    return error.data;
			})

            return promise;
        },

        getPicture: function () {
            var promise = $http.get(apihost + "images/single")
            .then(function (response) {
                console.log(response.data);
                return response.data;
            });

            return promise;
        },

        getPictureList: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(apihost + "images")

			.then(function (response) {
			    // The return value gets picked up by the then in the controller.
			    console.log(response.data);
			    return response.data;
			});
            // Return the promise to the controller
            return promise;
        },

        likePicture: function (pictureObject, userId) {
            var promise = $http({
                method: "post",
                url: apihost + "vote/like/" + userId,
                data: pictureObject
            })

			.then(function (response) {
			    return response.data;
			})

			.error(function (error) {
			    return error.data;
			})

            return promise;
        }
    };

    return pictureService;
});
