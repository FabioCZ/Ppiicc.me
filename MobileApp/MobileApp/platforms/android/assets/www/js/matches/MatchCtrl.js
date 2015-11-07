picmeControllers.controller('MatchCtrl', function (matchService, $scope) {
    var MatchCtrl = this;
    MatchCtrl.scope = $scope;

    MatchCtrl.Matches = [];

    MatchCtrl.Init();

    /* Method Declarations/Definitions */

    MatchCtrl.Init = function (matchService) {
        matchService.getMatches().then(function (data) {
            MatchCtrl.Matches = data;
        });
    }
});