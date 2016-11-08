`use strict`;
var express = require('express'),
    lodash = require('lodash'),
    bodyParser = require('body-parser'),
    awsServerless  =require('aws-serverless-express/middleware'),
    request = require('request');

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
    options.qs.q = req.body.text;
    request(options,(err, response, body)=>{
        if(err) throw new Error(error);
        var data = lodash.dropRight(lodash.chain(JSON.parse(body).data)
            .map(x => x.images.downsized.url)
            .shuffle()
            .value(),10);
        res.send({
          "text":"suggested gifs for "+options.qs.q,
          "attachments": lodash.map(data,(d)=>{
            return {"image_url":d,
                    "actions":[
                        { "name": "send",
                          "type": "button",
                            "value": d }
                    ]}
          }),
        });
    });

});

app.post('/respond',(req, res) => {
    console.log(req.body);
    res.send(req.body);
});

module.exports = app;
