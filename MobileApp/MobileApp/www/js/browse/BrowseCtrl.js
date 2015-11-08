picmeControllers.controller('BrowseCtrl', ['pictureService', '$scope', '$state', '$stateParams', function (userService, $scope, $state, $stateParams) {
    var BrowseCtrl = this;

    BrowseCtrl.Pictures = [];
    BrowseCtrl.Tag = "";

    BrowseCtrl.Init = function () {
        alert("Landing");

        BrowseCtrl.Tag = $stateParams.tagId;

        pictureService.getByTag($stateParams.tagId).then(function (data) {
            BrowseCtrl.Pictures = data;
        });
    }


    $scope.BrowseCtrl = BrowseCtrl;
    BrowseCtrl.Init();
}]);


/*picmeControllers.controller('BrowseCtrl', ['pictureService','$scope', '$state', '$stateParams', function (pictureService, $scope, $state, $stateParams) {
    // Controller Scope
    var BrowseCtrl = this;

    BrowseCtrl.Pictures = [];
    BrowseCtrl.Tag = "";

    BrowseCtrl.Init = function () {
        BrowseCtrl.Tag = $stateParams.tagId;

        pictureService.getByTag($stateParams.tagId).then(function (data) {
            BrowseCtrl.Pictures = data;
        });
    }

    /***** Start the Contr
    $scope.BrowseCtrl = BrowseCtrl;
    BrowseCtrl.Init();
    
}]);
*/