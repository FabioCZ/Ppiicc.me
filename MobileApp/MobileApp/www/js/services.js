angular.module('starter.services', [])
    .factory('matchService', function($http)
    {
        var matchService = {
            getMatches: function($http)
            {
                var promise = $http.get('api/matches')
			
                .then(function(response)
                {
                    return response.data;
                });
			
                return promise;
            }
        }
	
        return matchService;
    })

    .factory('pictureService', function ($http) {
        var pictureService = {
            getPicture: function () {
                var promise = $http.get('http://104.236.184.113:3000/api/images')
                .then(function (response) {
                    var randomIndex = Math.floor(Math.random() * response.data.length);
                    console.log(response.data[randomIndex]);
                    return response.data[randomIndex];
                });

                return promise;
            },

            getPictureList: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get('http://104.236.184.113:3000/api/images')

                .then(function (response) {
                    // The return value gets picked up by the then in the controller.
                    console.log(response.data);
                    return response.data;
                });
                // Return the promise to the controller
                return promise;
            },

            submitVote: function (pictureObject) {
                var promise = $http({
                    method: "post",
                    url: "/api/images/vote"
                })

                .then(function (response) {
                    return response.data;
                })
                .error(function (error) {
                    return error.data;
                })

                return promise;
            }
        };

        return pictureService;
    })

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
