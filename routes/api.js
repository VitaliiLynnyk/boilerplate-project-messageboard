/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;

module.exports = app => {
  app.route('/api/threads/:board');
  
  app.route('/api/replies/:board');
};
