'use strict';

const BlogPost = require('./model');
const Response = require('../../utils/response');

class BlogController {
  static async index(req, res) {
    try {
      const posts = await BlogPost.all();
      return Response.success(res, 'Success fetch blog posts', posts);
    } catch (error) {
      return Response.error(res, error.message);
    }
  }

  static async store(req, res) {
    try {
      const { title, content, author, category } = req.body;
      const slug = title.toLowerCase().replace(/ /g, '-');
      
      const post = await BlogPost.create({
        title,
        slug,
        content,
        author,
        category
      });

      return Response.success(res, 'Blog post created successfully', post, 201);
    } catch (error) {
      return Response.error(res, error.message);
    }
  }
}

module.exports = BlogController;
