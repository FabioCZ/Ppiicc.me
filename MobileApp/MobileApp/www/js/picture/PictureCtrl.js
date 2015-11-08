picmeControllers.controller('PictureCtrl', ['pictureService', 'userService', '$ionicHistory', '$scope', '$state', function (pictureService, userService, $ionicHistory, $scope, $state) {
    // Controller Scope
    var PictureCtrl = this;
    PictureCtrl.scope = $scope;

    PictureCtrl.PageTitle = "View Pictures";

    PictureCtrl.PictureMeta = {};

    // lol scope

    /*****  Method Definitions *****/

    PictureCtrl.UpdatePicture = function () {
        pictureService.getPicture().then(function (data) {
            PictureCtrl.PictureMeta = data;
        });
    }

    PictureCtrl.DislikePicture = function () {
        pictureService.dislikePicture(PictureCtrl.PictureMeta, userService.getUsername())

		.success(function (data) {
		    // Maybe display a message here or something

		    // Get a new picture
		    PictureCtrl.UpdatePicture();
		})

		.error(function (data) {
		    alert("There was an error.  Sorry.");
		})
    }

    PictureCtrl.Init = function () {
        var Username = userService.getUsername();
        PictureCtrl.PageTitle = Username;
        PictureCtrl.UpdatePicture();
    };
    
    PictureCtrl.LikePicture = function () {
        pictureService.likePicture(PictureCtrl.PictureMeta, userService.getUsername())

		.success(function (data) {
		    // Maybe display a message here or something

		    // Get a new picture
		    PictureCtrl.UpdatePicture();
		})

		.error(function (data) {
		    alert("There was an error.  Sorry.");
		})
    }

    PictureCtrl.StartBrowse = function (tag) {
        $state.go('tab.browse', { tagId: tag });
    }

    /***** Run the Controller ****/
    $scope.PictureCtrl = PictureCtrl;
    PictureCtrl.Init();
}]);
