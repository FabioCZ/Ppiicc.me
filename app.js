var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var db = require("monk")('mongodb://0.0.0.0:27017/picme');
var assert = require('assert');
var stdio = require('stdio');
var Clarifai = require('./other_libs/clarifai_node.js');
var API500px = require('500px');
var api500px = new API500px('uoJZAXqlLu6vuci8LrzmaRTeGmMjWTLRA2tBkjtp');
var url = 'mongodb://0.0.0.0:27017/picme';
var app = express();

imagesCollection = db.get("images");

Clarifai.initAPI("0OGzXX35e4FTWIXN2Gxm1UQTPxyKRMQjZ70ZQlQf", "p4C6nhkTXC16j0FuWFR-AQ3tM6IBt5ZMT1qNydH0");

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) {
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});

function GetPicAndTags(){
  api500px.photos.getFreshToday({'sort': 'created_at', 'rpp': '20', 'image_size' : 21},  function(error, results) {
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
	allImages = []
	for(i = 0; i < res.length;i++)
	{
	    imageObj = {}
	    imageObj.url = res[i].url
	    imageObj.tags = []
	    var tag_ct = res[i].result['tag']['classes'].length < 4 ? res[i].result['tag']['classes'].length : 4
		for(j = 0; j < tag_ct;j++)
		{
	      		imageObj.tags.push(res[i].result['tag']['classes'][j])
		}
		allImages.push(imageObj)
	}
	lookForDuplicateShitAndInsertShit(allImages)
}

function lookForDuplicateShitAndInsertShit(imgs)
{

	function checkThenInsert (img, callback) {

		imagesCollection.findOne(img, function(err, docs){

			if(!docs){
				imagesCollection.insert(img, function (err, result) {

					callback();

				});
			} else {
				process.nextTick(callback);
			}
		})

	}

	function iterateThroughImgs () {

		var img = imgs.shift();

		if (!img) {
			console.log('done');
			return;
		}

		checkThenInsert(img, iterateThroughImgs);

	}

	iterateThroughImgs();
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
			if( typeof res["status_code"] === "string" &&
				( res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR" )) {
				GetPicAndTagsCallback(res.results)
			}
	}
}

var imageUpdater = setTimeout(function(){
	if (imagesCollection.find().count() < 500){
			GetPicAndTags()
	}else{
		console.log("db full")
	}
}, 1000 * 60 * 30);

var router = express.Router();

router.get('/images', function(req, res){
		imagesCollection.find({},function(err, res){
			json.send(res);
		})
});



app.use('/api', router);

app.use(express.static('public'));
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
