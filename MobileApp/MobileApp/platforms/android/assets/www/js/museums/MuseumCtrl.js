picmeControllers.controller('MuseumCtrl', ['museumService', '$scope', '$state', function (museumService, $scope, $state) {
    $scope.Museums = [];

    museumService.getMuseums().then(function (data) {
        $scope.Museums = data;
    })
}]);