picmeServices.factory('museumService', function ($http) {
    var museumService = {
        getMuseums: function () {
            var promise = $http.get("https://opendata.utah.gov/resource/2ikc-bdah.json")
           .then(function (response) {
               console.log(response.data);
               return response.data;
           });

            return promise;
        }
    }

    return museumService;
});