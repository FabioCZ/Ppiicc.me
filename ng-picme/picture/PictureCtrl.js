picmeApp.controller('PictureCtrl', ['pictureService', '$scope', pictureService, function($scope) {
	// Controller Scope
	var PictureCtrl = this;
	PictureCtrl.scope = $scope;
	
	// A picturrrr up in hurrrrr
	PictureCtrl.Picturrrrr = [];
	
	// Run the controller
	PictureCtrl.Init();
	
	/* Method Definitions */
	
	PictureCtrl.DislikePicture = function() {
		PictureCtrl.Picturrrrr.vote = false;
		pictureService.submitVote(PictureCtrl.Picturrrr)
			.then(function(data)
			{
				// Maybe display a message here or something
			});
	}
	
	PictureCtrl.Init = function() {
		pictureService.getPicture().then(function(data) {
    		PictureCtrl.picture = data;
  		});
	};
}]);