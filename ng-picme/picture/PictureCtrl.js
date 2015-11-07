picmeApp.controller('PictureCtrl', ['pictureService', '$scope', pictureService, function($scope) {
	// Controller Scope
	var PictureCtrl = this;
	PictureCtrl.scope = $scope;
	
	PictureCtrl.picture = [];
	
	// Run the controller
	PictureCtrl.Init();
	
	/* Method Definitions */
	
	PictureCtrl.Init = function() {
		
	};
}]);