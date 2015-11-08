picmeControllers.controller('UserCtrl', ['userService', '$scope', '$state', function (userService, $scope, $state)
{
    var UserCtrl = this;


    $scope.UserCtrl = UserCtrl;

    /***** Method Definitions *****/
    UserCtrl.Init = function()
    {
        // Do something
    }

    UserCtrl.Login = function()
    {
        userService.getUser(UserCtrl.Username).then(function (data) {
            alert("Login Successful");
            $state.go('tab.pictures');
        });
        
        
    }

    /***** Run the Controller *****/

    UserCtrl.Init();
}]);