picmeControllers.controller('PictureCtrl', ['pictureService', 'userService', '$scope', function (pictureService, userService, $scope) {
    // Controller Scope
    var PictureCtrl = this;
    PictureCtrl.scope = $scope;

    // A picturrrr up in hurrrrr
    PictureCtrl.Picturrrrr = [];

    // Run the controller
    PictureCtrl.Init();

    /*****  Method Definitions *****/

    /* Method Definitions */
    PictureCtrl.DislikePicture = function () {
        pictureService.dislikePicture(PictureCtrl.Picturrrr, userService.getUsername())

		.success(function (data) {
		    // Maybe display a message here or something

		    // Get a new picture
		    PictureCtrl.UpdatePicture();
		})

		.error(function (data) {
		    alert("There was an error.  Sorry.");
		})
    }

    PictureCtrl.LikePicture = function () {
        PictureCtrl.Picturrrr.vote = true;
        pictureService.submitVote(PictureCtrl.Picturrrr)
			.then(function (data) {
			    // Display a message here
			})
    }

    PictureCtrl.UpdatePicture = function () {
        pictureService.getPicture().then(function (data) {
            PictureCtrl.Picturrrr = data;
        });
    }

    PictureCtrl.Init = function () {
        PictureCtrl.UpdatePicture();
    };
}]);
