`use strict`;
var express = require('express'),
    async = require('async'),
    lodash = require('lodash'),
    bodyParser = require('body-parser'),
    awsServerless  =require('aws-serverless-express/middleware'),
    request = require('request-promise');

var app = express();
app.listen(3000,()=>{
  console.log('listening on 3000')
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(awsServerless.eventContext());

var options = {
    method:'GET',
    url: 'http://api.giphy.com/v1/gifs/search',
    qs: { api_key: 'dc6zaTOxFJmzC', limit: 15 }
};

app.post('/gifs',(req,res) => {
    console.log(req.body);
    options.qs.q = req.body.text;
    fetchgifs(req.body.response_url).then(()=>{
        console.log('*****sending response *******');
        res.send({"text":"Looking for gifs about "+req.body.text});
    });
    // async.series([
    // function(cb){
    //     fetchgifs(req.body.response_url).then(()=>cb());
    // },
    // function(cb){
    //     console.log('************************ intermediate **********************');
    //     res.send({"text":"looking for gifs about "+req.body.text});
    //     cb();
    // }
    // ],()=>{
    //     console.log('************************* Express response *****************');
        // res.send({"text":"Looking for gufs about "+req.body.text});
    // });
});


var fetchgifs = function(url){
    return request(options,(err, response, body)=>{
        if(err) throw new Error(error);
        var data = lodash.dropRight(lodash.chain(JSON.parse(body).data)
            .map(x => x.images.downsized.url)
            .shuffle()
            .value(),10);
        delayed(data,url);
    });
};

var delayed = function (gifs,url) {
    var body = {
        "text":"suggested gifs for "+options.qs.q,
        "attachments": lodash.map(gifs,(d)=>{
            return {"image_url":d}
        }),
    };
    request({
        method:'POST',
        url:url,
        body: JSON.stringify(body),
        },(err, res, body)=>{
        console.log(body);
    });
    };
module.exports = app;
