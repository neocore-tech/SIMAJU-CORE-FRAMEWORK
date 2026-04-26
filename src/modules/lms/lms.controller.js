'use strict';

const LmsService = require('./lms.service');
const Response = require('../../utils/response');

/**
 * LMS Controller
 */
class LmsController {
  async catalog(req, res) {
    try {
      const courses = await LmsService.getCourseCatalog();
      return Response.success(res, courses);
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  async courseDetail(req, res) {
    try {
      const detail = await LmsService.getCourseFullStructure(req.params.slug);
      return Response.success(res, detail);
    } catch (err) {
      return Response.error(res, err.message, 404);
    }
  }

  async enroll(req, res) {
    try {
      const enrollment = await LmsService.enrollUser(req.user.id, req.body.course_id);
      return Response.success(res, enrollment, 'Successfully enrolled in course');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  async completeLesson(req, res) {
    try {
      const result = await LmsService.completeLesson(req.user.id, req.params.lessonId);
      return Response.success(res, result, 'Lesson marked as completed');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }
}

module.exports = new LmsController();
