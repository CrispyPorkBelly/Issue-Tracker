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

      const issue_title   = req.body.issue_title;
      const issue_text    = req.body.issue_title;
      const created_by    = req.body.created_by;
      const assigned_to   = req.body.assigned_to;
      const status_text   = req.body.status_text;

      const newIssue = new Issue({
        "issue_title": issue_title,
        "issue_text": issue_text,
        "created_by": created_by,
        "assigned_to": assigned_to,
        "status_text": status_text
      });
      // console.log(newIssue);

      newIssue.save()
       .then( issue => {
         console.log(issue);
         res.send({
          "issue_title": issue.issue_title,
          "issue_text": issue.issue_text,
          "created_on": issue.created_on,
          "updated_on": issue.updated_on,
          "created_by": issue.created_by,
          "assigned_to": issue.assigned_to,
          "status_text": issue.status_text,
          "open": issue.open,
          "status_text": issue.status_text,
          "_id": issue._id
         })
       }).catch(err => {
        console.log(err.message);
         res.status(500).send({
           message: err.message || "Error has occured in saving new user"
       });
    });
  })
    
    .put(function (req, res){
      var project = req.params.project;
      const issueId       = req.body._id;
      const issue_title   = req.body.issue_title;
      const issue_text    = req.body.issue_title;
      const created_by    = req.body.created_by;
      const assigned_to   = req.body.assigned_to;
      const status_text   = req.body.status_text;
      const closedValue   = (typeof req.body.open == 'undefined') ? false : true;

      console.log(issueId);
      
      Issue.findByIdAndUpdate( issueId, {
        "issue_title": issue_title,
        "issue_text": issue_text,
        "updated_on": Date.now(),
        "created_by": created_by,
        "assigned_to": assigned_to,
        "status_text": status_text,
        "closed": closedValue
      }
      ).then(issue => {
        console.log('Updating issue');
        res.send({
          "issue_title": issue.issue_title,
          "issue_text": issue.issue_text,
          "created_on": issue.created_on,
          "updated_on": issue.updated_on,
          "created_by": issue.created_by,
          "assigned_to": issue.assigned_to,
          "status_text": issue.status_text,
          "open": issue.open,
          "status_text": issue.status_text,
          "_id": issue._id
        })
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Error occured in updating issue log for issue"
          });
      });
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      console.log('hi');

      const issueId       = req.body._id;
      Issue.findByIdAndRemove( issueId
      ).then( issue => {
        console.log('Deleting issue');
        res.send({
          "issue_title": issue.issue_title,
          "issue_text": issue.issue_text,
          "created_on": issue.created_on,
          "updated_on": issue.updated_on,
          "created_by": issue.created_by,
          "assigned_to": issue.assigned_to,
          "status_text": issue.status_text,
          "open": issue.open,
          "status_text": issue.status_text,
          "_id": issue._id
        })
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Error occured in deleting issue log for issue"
          });
      });
    });
    
};
