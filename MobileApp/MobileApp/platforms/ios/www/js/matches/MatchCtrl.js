picmeControllers.controller('MatchCtrl', function (matchService, userService, $scope) {
    var MatchCtrl = this;

    MatchCtrl.PageTitle = "Your Matches";
    MatchCtrl.Matches = {};

    /***** Method Declarations/Definitions *****/

    MatchCtrl.Init = function () {
        var Username = userService.getUsername();

        MatchCtrl.PageTitle = Username;

        console.log(Username);
        matchService.getMatches(Username).then(function (data) {
            console.log(data);
            MatchCtrl.Matches = data;
        });
    }

    /***** Run the Controller *****/
    $scope.MatchCtrl = MatchCtrl;
    MatchCtrl.Init();
});