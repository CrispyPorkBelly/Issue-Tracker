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
      Issue.find({}) //only return username field
        .then(issues => {
          // console.log(issues);
          res.send(issues);
        }).catch(err => {
          res.status(500).send({
            message: err.message || "Error occured in retrieving all issues"
          });
        });
    })
    
    .post(function (req, res){
      var project = req.params.project;

      const issue_title   = req.body.issue_title;
      const issue_text    = req.body.issue_text;
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
        // console.log(err.message);
         res.status(500).send({
           message: err.message || "Error has occured in saving new user"
       });
    });
  })
    
    .put(function (req, res){
      var project = req.params.project;
      const issueId       = req.body._id;
      const issue_title   = req.body.issue_title;
      const issue_text    = req.body.issue_text;
      const created_by    = req.body.created_by;
      const assigned_to   = req.body.assigned_to;
      const status_text   = req.body.status_text;
      const closedValue   = (typeof req.body.open == 'undefined') ? true : false;
      Issue.findByIdAndUpdate( issueId, 
        {
        "issue_title": issue_title,
        "issue_text": issue_text,
        "updated_on": Date.now(),
        "created_by": created_by,
        "assigned_to": assigned_to,
        "status_text": status_text,
        "open": closedValue
      }
      ).then(issue => {
        //If no issue exists with that ID, throw this error
        if (!issue) {
          return res.send("Could not update issue: " + issueId);
        }
        
        res.send("Successfully updated issue: " + issue._id);
      })
      .catch(err => {
        if (err.kind === 'ObjectId') {
          return res.send("Could not update  issue: " + issueId);
        }

        // console.log(err.message);
        res.send("Error occured in updating issue log for issue");
      });
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      const issueId       = req.body._id;

      Issue.findByIdAndRemove( issueId
      ).then( issue => {
        if (!issue) {
          return res.send("Could not delete issue: " + issueId);
        }

        res.send("Successfully deleted issue: " + issueId)
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.send("Could not delete issue: " + issueId);
        }

        res.send({
          message: err.message || "Error occured in deleting issue log for issue"
          });
      });
    });
    
};
