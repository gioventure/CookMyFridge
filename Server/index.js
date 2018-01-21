'use strict'

var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
const express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	mongoURI = "mongodb://CookMyFridge:redbull@ds111138.mlab.com:11138/cook-my-fridge";

MongoClient.connect(mongoURI , function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to Mongo server");

  db.close();
});

app.set('port', (process.env.PORT || 5000))

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res) {
	res.send('App Online!')
})

app.post('/getRecipes/', function(req, res) {
    console.log(req.body);
    let ingredients = req.body.ingredients;
    MongoClient.connect(mongoURI , function(err, client) {
        assert.equal(null, err);
        const db = client.db("cook-my-fridge");
        const collection = db.collection('recipes');
        collection.find({"ingredients_lower": { "$all": ingredients.toLowerCase()}}).limit(3).toArray(function(err, docs){
            console.log(docs);
            res.send(docs);
        })
        client.close();
    });
})