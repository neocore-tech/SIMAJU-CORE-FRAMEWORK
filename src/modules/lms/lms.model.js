'use strict';

const Model = require('../../database/model');

class Course extends Model {
  static table = 'lms_courses';
}

class Module extends Model {
  static table = 'lms_modules';
}

class Lesson extends Model {
  static table = 'lms_lessons';
}

class Enrollment extends Model {
  static table = 'lms_enrollments';
}

class Progress extends Model {
  static table = 'lms_progress';
}

module.exports = { Course, Module, Lesson, Enrollment, Progress };
