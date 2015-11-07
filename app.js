var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var Clarifai = require('./other_libs/clarifai_node.js');
var API500px = require('500px');

var db = require("monk")('mongodb://0.0.0.0:27017/picme');
var api500px = new API500px('uoJZAXqlLu6vuci8LrzmaRTeGmMjWTLRA2tBkjtp');
Clarifai.initAPI("0OGzXX35e4FTWIXN2Gxm1UQTPxyKRMQjZ70ZQlQf", "p4C6nhkTXC16j0FuWFR-AQ3tM6IBt5ZMT1qNydH0");

var app = express()
imagesCollection = db.get("images");
userCollection = db.get("users");

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) {
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});

function GetPicAndTags(){
	console.log("started getting more img data")
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
	console.log("fetched data, now trying to insert img data into db")
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
// var imageUpdater = setTimeout(function(){
// 	if (imagesCollection.find().count() < 500){
GetPicAndTags()
// 	}else{
// 		console.log("db full")
// 	}
// }, 1000 * 60 * 30);


var router = express.Router();
app.use('/api', router);

router.get('/images', function(req, res){
	imagesCollection.find({},function(err, docs){
		res.json(docs);
	})
});

router.get('/images/single', function(req, res){
	imagesCollection.find().random(function(err, docs) {
		res.json(docs);
	})
});

router.get('/user/:userId', function(req, res){
	userCollection.findOne({'name': req.params.userId},function(err, doc){
		if(doc){
			//user exists return
			res.json(doc)
		}else{
			//create new user and return
			user = {}
			user.name = req.params.userId
			userCollection.insert(user, function(err, doc){
				if(err) throw err;
				res.json(user)
			})
		}
	})
});

router.post('/user/userId',bodyParser.json() function(req, res){
	var userToInsert = Object.keys(req.body)[0]

	console.log("post: ")
	console.log(userToInsert)
	console.log(userToInsert._id)
	console.log(userToInsert.name)
	delete userToInsert._id
	console.log(userToInsert)

	userCollection.findOne({'name': userToInsert.name},function(err, doc){
		if(doc){
			userCollection.remove({'name': userToInsert.name}, function(err, doc){
				if(err) throw err;
			})
		}

		userCollection.insert(req.body, function(err, doc){
			if(err) throw err;
			res.send("success")
		})
	})
})

//router.get()



app.use(express.static('public'));
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
