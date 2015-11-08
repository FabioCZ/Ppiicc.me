picmeServices.factory('matchService', function ($http) {
    var apihost = "http://104.236.184.113:3000/api/";

    var matchService = {
        getMatches: function (userId) {
            var promise = $http.get(apihost + "matches/" + userId)

            .then(function (response) {
                return response.data;
            });

            return promise;
        }
    }

    return matchService;
});