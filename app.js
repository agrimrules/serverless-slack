`use strict`;
var express = require('express'),
    lodash = require('lodash'),
    awsServerless  =require('aws-serverless-express/middleware'),
    request = require('request');

var app = express();
app.listen(3000,()=>{
  console.log('listening on 3000')
});
app.use(awsServerless.eventContext());

var options = {
    method:'GET',
    url: 'http://api.giphy.com/v1/gifs/search',
    qs: { api_key: 'dc6zaTOxFJmzC' }
};

app.get('/gifs',(req,res) => {
    options.qs.q = req.query.term;
    request(options,(err, response, body)=>{
        if(err) throw new Error(error);
        var data = lodash.dropRight(lodash.chain(JSON.parse(body).data)
            .map(x => x.images.downsized.url)
            .shuffle()
            .value(),20);
        res.send(data);
    });

});

module.exports = app;
