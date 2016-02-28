var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');


var app = express();
app.use(helmet.hidePoweredBy());

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

app.use(express.static('dist'));
app.use(bodyParser.json());






app.post('/annotate',function(req,res){
    console.log(req.body);
    var id=req.body._id;
    var annotation = req.body.annotation;
    var url = 'mongodb://localhost:27017/thesis';
    MongoClient.connect(url, function(err, db) {
            db.collection('web')
            .updateOne({'_id':id},{$set:{'Annotation':annotation}},
            function(err, results){
                db.close();
                res.send('ok');
            });
    });
});

app.get('/next',function(req,res){
    var url = 'mongodb://localhost:27017/thesis';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('web')
            .find({'Annotation':'No'},{'text':1})
            .limit(1);

        var tweets = [];
        cursor.each(function(err,doc){
            if(err){
                console.log(err);
            }
            if(doc!=null){
                tweets.push(doc);
            }else{
                db.close();
                res.json(tweets);
            }
        });
    });
});


app.listen(8000, function () {
  console.log('Spot the slur on port 8000!');
});