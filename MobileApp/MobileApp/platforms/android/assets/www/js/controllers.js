angular.module('starter.controllers', [])

.controller('MatchCtrl', function(matchService, $scope)
{
    var MatchCtrl = this;
    MatchCtrl.scope = $scope;
	
    MatchCtrl.Matches = [];
	
    MatchCtrl.Init();
	
    /* Method Declarations/Definitions */
	
    MatchCtrl.Init = function(matchService)
    {
        matchService.getMatches().then(function (data) {
            MatchCtrl.Matches = data;
        });
    }
})

    .controller('PictureCtrl', ['pictureService', '$scope', function (pictureService, $scope) {
        // Controller Scope
        var PictureCtrl = this;
        PictureCtrl.scope = $scope;
        $scope.PictureCtrl = PictureCtrl;

        // A picturrrr up in hurrrrr
        PictureCtrl.Picturrrrr = [];

        /***** Method Definitions *****/

        PictureCtrl.DislikePicture = function () {
            PictureCtrl.Picturrrrr.vote = false;
            pictureService.submitVote(PictureCtrl.Picturrrr)
                .then(function (data) {
                    // Maybe display a message here or something
                });
        }

        PictureCtrl.Init = function () {
            PictureCtrl.UpdatePicture();
        };

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

        /*****  Run the Controller  *****/

        PictureCtrl.Init();
    }])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
