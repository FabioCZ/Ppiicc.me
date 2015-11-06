//Setup
var stdio = require('stdio');
var Clarifai = require('./other_libs/clarifai_node.js');
var API500px = require('500px'),
    api500px = new API500px('uoJZAXqlLu6vuci8LrzmaRTeGmMjWTLRA2tBkjtp');

Clarifai.initAPI("0OGzXX35e4FTWIXN2Gxm1UQTPxyKRMQjZ70ZQlQf", "p4C6nhkTXC16j0FuWFR-AQ3tM6IBt5ZMT1qNydH0");

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) { 
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});
//End Setup


function GetPicAndTags(){

api500px.photos.getFreshToday({'sort': 'created_at', 'rpp': '50', 'image_size' : 21},  function(error, results) {
	  if (error) {
	    console.log(error) 
	    return;
	  }
	 	image_urls = results.photos.map(function(val) { return val.image_url })
	 	ids = image_urls.map(function() { return "test_id"})

	 	Clarifai.tagURL( image_urls , ids, commonResultHandler );
	});
}

function GetPicAndTagsCallback(res)
{
	for(i = 0; i < res.length;i++)
	{
		console.log(res[i].url)
		var tag_ct = res[i].result['tag']['classes'].length < 5 ? res[i].result['tag']['classes'].length : 5
		for(j = 0; j < tag_ct;j++)
		{
			console.log(res[i].result['tag']['classes'][j])

		}
	}
}

function commonResultHandler( err, res ) {
	if( err != null ) {
		if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
			console.log("TAG request timed out");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
			console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
			console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
			console.log("Clarifai host is throttling this application.");				
		}
		else {
			console.log("TAG request encountered an unexpected error: ");
			console.log(err);				
		}
	}
	else {
			// if some images were successfully tagged and some encountered errors,
			// the status_code PARTIAL_ERROR is returned. In this case, we inspect the
			// status_code entry in each element of res["results"] to evaluate the individual
			// successes and errors. if res["status_code"] === "OK" then all images were 
			// successfully tagged.
			if( typeof res["status_code"] === "string" && 
				( res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR" )) {
				GetPicAndTagsCallback(res.results)
			}		
	}
}

GetPicAndTags(GetPicAndTagsCallback);