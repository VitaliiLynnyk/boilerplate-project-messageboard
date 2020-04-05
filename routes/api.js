/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
const { RepliesController, ThreadController } = require('../controllers');

module.exports = app => {
  app.route('/api/threads/:board')
     .get(ThreadController.getThread);
  
  app.route('/api/replies/:board')
     .get(RepliesController.getReplies);
};
