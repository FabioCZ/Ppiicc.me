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
var jsonParser = bodyParser.json()
imagesCollection = db.get("images");
userCollection = db.get("users");

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) {
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});

function GetPicAndTags(){
	console.log("started getting more img data")
	api500px.photos.getFreshToday({'sort': 'created_at', 'rpp': '20', 'image_size' : 600},  function(error, results) {
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

//GetPicAndTags()


// var router = express.Router();
// app.use('/api', router);

app.get('/api/images', function(req, res){
	imagesCollection.find({},function(err, docs){
		res.json(docs);
	})
});

app.get('/api/images/single', function(req, res){
	imagesCollection.find({}, function(err, docs) {
		res.json(docs[Math.floor(Math.random()*docs.length)]);
	})
});

app.get('/api/images/next/:userId', function(req, res){
	userCollection.findOne({'name': req.params.userId},function(err, doc){
		if(doc){
			//get all imgs
			imagesCollection.find({}, function(err, imgs) {
				var imgToTry = imgs[Math.floor(Math.random()*imgs.length)]
				while(doc.liked.indexOf(imgToTry) > -1 || doc.liked.indexOf(imgToTry) > -1){
					imgToTry = imgs[Math.floor(Math.random()*imgs.length)].url
				}
				res.json(imgToTry)
			})
		}
		else
		{
			res.send("User not found")
		}
	})
})


app.get('/api/user/:userId', function(req, res){
	userCollection.findOne({'name': req.params.userId},function(err, doc){
		if(doc){
			//user exists return
			res.json(doc)
		}else{
			//create new user and return
			user = {}
			user.name = req.params.userId
			user.liked = new Array()
			user.disliked = new Array()
			users.likedTags =  {}
			users.dislikedTags = {}
			userCollection.insert(user, function(err, doc){
				if(err) throw err;
				res.json(user)
			})
		}
	})
});

app.post('/api/user/userId', jsonParser, function(req, res){
	var userToInsert = req.body
	console.log("inserting: ")
	console.log(userToInsert)
	delete userToInsert._id

	userCollection.findOne({'name': userToInsert.name},function(err, doc){
		if(doc){
			userCollection.remove({'name': userToInsert.name}, function(err, doc){
				if(err) throw err;
				console.log("deleted " + userToInsert.name)
			})
		}

		userCollection.insert(req.body, function(err, doc){
			if(err) throw err;
			res.send("success")
		})
	})
})

app.post('/api/vote/like/:userId',jsonParser, function(req, res){
	console.log("voting like")
	console.log(req.params.userId)
	console.log(req.body)
	userCollection.findOne({'name':  req.params.userId},function(err, doc){
		if(doc){
			console.log("Doc:")
			console.log(doc)
			doc.liked.push(req.body)

			for(i = 0; i < req.body.tags.length;i++)
			{
				if(doc.likedTags.hasProperty(req.body.tags[i]))
				{
					doc[req.body.tags[i]]++;
				}
				else
				{
					doc[req.body.tags[i]] = 1;
				}
			}

			userCollection.remove({'name': doc.name}, function(err, del){
				if(err) throw err;
				console.log("deleted " + doc.name)
				userCollection.insert(doc, function(err, ins){
					res.send("sucess")
				})
			})
		}
		else
		{
			res.send("User Not found")
		}
	})
})

app.post('/api/vote/dislike/:userId',jsonParser, function(req, res){
	console.log("voting dislike")
	console.log(req.params.userId)
	console.log(req.body)
	userCollection.findOne({'name':  req.params.userId},function(err, doc){
		if(doc){
			console.log("Doc dislike:")
			console.log(doc)
			doc.disliked.push(req.body)
			userCollection.remove({'name': doc.name}, function(err, del){
				if(err) throw err;
				console.log("deleted " + doc.name)
				userCollection.insert(doc, function(err, ins){
					res.send("sucess")
				})
			})
		}
		else
		{
			res.send("User Not found")
		}
	})

})


app.get('api/matches/:userId', function(req, res){
	userCollection.find({} , function (err, doc){

	})

	res.json({"matches" : ["1", "2"]})
})



app.use(express.static('public'));
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
