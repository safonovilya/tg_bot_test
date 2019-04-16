const assert = require('assert');
const db = require('../db');
const Event = require('mongoose').model('Event');

describe('Create Event Object', () => {
  it('Event', done => {
    const event = new Event();
    event.save().then(() => {
      done();
    });
  });
});
