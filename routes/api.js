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
      
      //compile search criteria based on optional query parameters
      const searchCriteria = {};
      // console.log(req.query);

      if (req.query._id) {
        searchCriteria._id = req.query._id;
      }
      if (req.query.issue_title) {
        searchCriteria.issue_title = req.query.issue_title;
      }
      if (req.query.issue_text) {
        searchCriteria.issue_text = req.query.issue_text;
      }
      //Opting to not implement this feature as it is not as needed such as opened /closed status.
      // if (req.query.created_by) {
      //   searchCriteria.created_by = req.query.created_by;
      // }
      // if (req.query.updated_on) {
      //   searchCriteria.updated_on = req.query.updated_on;
      // }
      if (req.query.assigned_to) {
        searchCriteria.assigned_to = req.query.assigned_to;
      }
      if (req.query.status_text) {
        searchCriteria.status_text = req.query.status_text;
      }
      if (req.query.open) {
        searchCriteria.open = req.query.open;
      }

      // console.log(searchCriteria);
      
      Issue.find(searchCriteria) 
        .then(issues => {
          // console.log(issues);



          res.send(issues);
        }).catch(err => {
          res.status(500).send({
            message: err.message || "Error occured in retrieving issues"
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
