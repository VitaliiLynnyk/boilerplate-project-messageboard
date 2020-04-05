/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  suite('API ROUTING FOR /api/threads/:board', () => {
    
    suite('POST', () => {
      test('post new thread', done => {
        chai.request(server)
            .post('/api/threads/test/')
            .type('form')
            .send({
              '_method': 'post',
              'text': 'test',
              'delete_password': 'test'
            })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200');
              assert.isNotEmpty(res.text, 'response string should be an html page, not an empty string');
              done();
            });
      });
    });
    
    suite('GET', () => {
      test('get board', done => {
        chai.request(server)
            .get('/b/test/')
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200');
              assert.isNotEmpty(res.text, 'response string should be an html page, not an empty string');
              done();
            });
      });
    });
    
    suite('DELETE', () => {
      test('delete board', done => {
        chai.request(server)
            .delete('/api/threads/test')
            .type('form')
            .send({
              '_method': 'delete',
              'thread_id': '5e89f44ce78fbd98c9dc302c',
              'delete_password': 'test'
            })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200');
              assert.isNotEmpty(res.text, 'response string should not be an empty');
              expect(res.text).to.satisfy(val => {
                return (val === '"success!"') || (val === '"incorrect password"') || (val === '"Sorry, we couldn\'t find that thread!"');
              });
              done();
            });
      });
    });
    
    suite('PUT', () => {
      test('get board', done => {
        chai.request(server)
            .put('/api/threads/test')
            .type('form')
            .send({
              '_method': 'put',
              'report_id': '5e89f7d375a4dbe29596d6e1',
            })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200');
              assert.isNotEmpty(res.text, 'response string should not be empty');
              expect(res.text).to.satisfy(val => {
                return (val === '"success!"') || (val === '"failure"');
              });
              done();
            });
      });
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', () => {
    
    suite('POST', () => {
      test('post reply to a thread', done => {
        chai.request(server)
            .post('/api/replies/test')
            .type('form')
            .send({
              '_method': 'post',
              'text': 'test',
              'delete_password': 'test',
              'thread_id': '5e89f7d375a4dbe29596d6e1',
              'reported': false
            })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200');
              assert.isNotEmpty(res.text, 'response string should not be empty');
              done();
            });
      });
    });
    
    suite('GET', () => {
      test('get replies to a thread', done => {
        chai.request(server)
            .get('/b/test/5e89f7d375a4dbe29596d6e1')
            .end(function (err, res) {
              assert.equal(res.status, 200, 'response status should be 200');
              assert.isNotEmpty(res.text, 'response string should be an html page, not an empty string');
              done();
            });
      });
    });
    
    suite('PUT', () => {
      test('report a reply', done => {
        chai.request(server)
            .put('/api/replies/test')
            .type('form')
            .send({
              '_method': 'put',
              'thread_id': '5e89f87b75a4dbe29596dcb8',
              'reply_id': '5e89f88d9d254998e9cb532c',
            })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200');
              assert.isNotEmpty(res.text, 'response string should not be empty');
              expect(res.text).to.satisfy(val => {
                return (val === '"success!"') || (val === '"failure"');
              });
              done();
            });
      });
    });
    
    suite('DELETE', () => {
      test('delete reply', done => {
        chai.request(server)
            .delete('/api/replies/test')
            .type('form')
            .send({
              '_method': 'delete',
              'thread_id': '5e89f87b75a4dbe29596dcb8',
              'reply_id': '5e89f88d9d254998e9cb532c',
              'delete_password': 'test'
            })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200');
              assert.isNotEmpty(res.text, 'response string should not be an empty');
              expect(res.text).to.satisfy(val => {
                return (val === '"success!"') || (val === '"incorrect password"') || (val === '"Sorry, but we couldn\'t find that thread!"');
              });
              done();
            });
      });
    });
  });
});
