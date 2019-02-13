/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
const Issue = require("../app/models/issue.model");

mongoose.Promise = global.Promise;

module.exports = function (app) {

  mongoose.connect(process.env.DATABASE_URL, { 
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
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      console.log(req.query);
      // const newIssue = new Issue({
      //   ""
      // })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
