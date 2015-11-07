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
	console.log("imgs to be inserted: ")
	console.log(imgs)
	console.log("starting insert bitches")
	imagesCollection = db.get("images");
	for(x = 0; x < imgs.length; x++){
		imagesCollection.find(imgs[x], function(err, docs){
			console.log(docs);
			if(docs.length == 0){
				console.log('inserting:')
				console.log(imgs[x])
				imagesCollection.insert(imgs[x]);
			}
		})
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
			if( typeof res["status_code"] === "string" &&
				( res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR" )) {
				GetPicAndTagsCallback(res.results)
			}
	}
}

GetPicAndTags()

var router = express.Router();

router.get('/images', function(req, res){
    res.json({message:"Return all stored image data"});
});

router.get('/image/:imageId', function(req, res){
    res.json({message:"Return image data" + req.params.imageId});
});

router.get('/showAll', function(req, res){
	var getAll = function(db, callback) {
		var cursor =db.collection('picme').find( );
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				res.json(doc)
			} else {
				callback();
			}
		});
	};

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		getAll(db, function() {
			db.close();
		});
	});
});

app.use('/api', router);

app.use(express.static('public'));
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
