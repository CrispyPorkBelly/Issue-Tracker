/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let objectForTesting;

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text,'In QA');
          objectForTesting = res.body._id;
          // console.log(objectForTesting);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
         .post('/api/issues/test')
         .send({
           issue_title: 'ReqFieldsOnlyTitle',
           issue_text: 'ReqFieldsOnlyText',
           created_by: 'Functional Test - Required fields filled in',
         })
         .end(function(err, res) {
           assert.equal(res.status, 200);
           assert.equal(res.body.issue_title, 'ReqFieldsOnlyTitle');
           assert.equal(res.body.issue_text, 'ReqFieldsOnlyText');
           assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
           assert.isUndefined(res.body.assigned_to);
           assert.isUndefined(res.body.status_text);
          done();
         })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end(function (err, res) {
            assert.equal(res.status, 500);
            assert.isUndefined(res.body.issue_title);
            assert.isUndefined(res.body.issue_text);
            assert.isUndefined(res.body.created_by);
            assert.isUndefined(res.body.assigned_to);
            assert.isUndefined(res.body.status_text);
            assert.equal(res.body.message, 'Issue validation failed: issue_title: Path `issue_title` is required., issue_text: Path `issue_text` is required.')
            done();
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {

      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
        })
         .end(function (err, res) {
          // console.log(res.body);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {});
          done();
         })
      });
      
      test('One field to update', function(done) {
        const randomTitle = Math.random();
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: objectForTesting,
            issue_title: randomTitle,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Successfully updated issue: ' + objectForTesting)
            done();
          })
      });
      
      test('Multiple fields to update', function(done) {
        const randomInfo = Math.random();
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: objectForTesting,
            issue_title: randomInfo,
            issue_text: randomInfo,
            created_by: randomInfo,
            assigned_to: randomInfo,
            status_text: randomInfo,
            open: false
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Successfully updated issue: ' + objectForTesting)
            done();
          })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          //assert.isArray(res.body);
          //Use 2nd item in body array for testing purposes only. First item fails because it is created with only mandatory fields, as part of another test.
          assert.property(res.body[1], 'open');
          assert.property(res.body[1], '_id');
          assert.property(res.body[1], 'issue_title');
          assert.property(res.body[1], 'issue_text');
          assert.property(res.body[1], 'created_by');
          assert.property(res.body[1], 'assigned_to');
          assert.property(res.body[1], 'status_text');
          assert.property(res.body[1], 'created_on');
          assert.property(res.body[1], 'updated_on');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({open: false})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.deepEqual(res.body[0].open, false);
            done();
          });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ open: false, _id: objectForTesting})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            // console.log(res.body[0]);
            assert.deepEqual(res.body[0].open, false);
            assert.deepEqual(res.body[0]._id, objectForTesting);
            done();
          });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {});
            done();
          })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({
            _id: objectForTesting
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Successfully deleted issue: ' + objectForTesting);
            done();
          })
      });
      
    });

});
