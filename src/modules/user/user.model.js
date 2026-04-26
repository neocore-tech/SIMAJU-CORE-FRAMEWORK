'use strict';

const Model = require('../../database/model');

class User extends Model {
  static table = 'users';
}

module.exports = User;
