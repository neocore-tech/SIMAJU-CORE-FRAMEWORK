'use strict';

const Model = require('../../database/model');

class BlogPost extends Model {
  static table = 'blog_posts';
}

module.exports = BlogPost;
