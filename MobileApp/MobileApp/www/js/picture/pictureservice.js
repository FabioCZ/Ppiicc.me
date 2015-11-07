picmeServices.factory('pictureService', function ($http) {
    var pictureService = {
        getPicture: function () {
            var promise = $http.get('http://104.236.184.113:3000/api/images/single')
            .then(function (response) {
                console.log(response.data);
                return response.data;
            });

            return promise;
        },

        getPictureList: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('http://104.236.184.113:3000/api/images')

            .then(function (response) {
                // The return value gets picked up by the then in the controller.
                console.log(response.data);
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },

        submitVote: function (pictureObject) {
            var promise = $http({
                method: "post",
                url: "/api/images/vote"
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