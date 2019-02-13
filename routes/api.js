/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const dbConfig = require('./config/database.config.js');
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

mongoose.Promise = global.Promise;

module.exports = function (app) {

  mongoose.connect(dbConfig.url, { 
    useNewUrlParser: true 
  }).then( () => {
    console.log("Successfully connected to database");
  }).catch(err => {
    console.log("Failed to connect to database. Exiting now. Error: ", err);
    process.exit();
  });

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      console.log(req.params);
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
