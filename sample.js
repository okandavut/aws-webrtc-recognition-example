// SERVER FOR A REALEYES HOMEWORK
// THIS SERVER DOES A PUTOBJECT AND DETECTFACES
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
fs = require('fs');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//config for region
AWS.config.update({region:'us-west-2'});

//CONFIG AWS
AWS.config.apiVersions = {
  rekognition: '2016-06-27',
};

//ADD ALLOW ORIGIN ( Cross Origin Errro )
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var rekognition = new AWS.Rekognition();
var s3 = new AWS.S3();

//keyname for uploaded photo 
var keyName = 'photofrombucket.jpg';

//Detectfaces params
var faceParams={
 Image: {
        S3Object: {
        Bucket: "realeyeshomework",
        Name:keyName
        }
      },
 Attributes: [
    "ALL"
  ]
};

//rest function for putobject and detectfaces
app.post('/addPhotoDetectFace', function (req, res) {
  //Convert base64 to Buffer Array for putobject function
 var base64data=new Buffer(req.body.photo.replace(/^data:image\/\w+;base64,/, ""),'base64');
  var params = {Bucket:  "realeyeshomework", Key:keyName, Body: base64data};
   s3.putObject(params, function(err, data) {
     if (err)
       console.log(err)
     else{
       console.log("Successfully uploaded photo from bucket");
      //if upload Successfully detect faces will work
       rekognition.detectFaces( faceParams, function(error, response) {
        if (error) console.log(error, error.stack); // an error occurred
        else  res.send(response);
    });
     }
   });
});


// START SERVER FROM localhost:8081
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
