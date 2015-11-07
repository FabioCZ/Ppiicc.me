picmeApp.factory('matchService', function($http)
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
});