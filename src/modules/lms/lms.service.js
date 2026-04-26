'use strict';

const { Course, Module, Lesson, Enrollment, Progress } = require('./lms.model');
const DB = require('../../database');

/**
 * LMS Service
 */
class LmsService {
  // ── Course Management ───────────────────────────────────────
  async getCourseCatalog() {
    return Course.all();
  }

  async getCourseFullStructure(slug) {
    const course = await DB.table('lms_courses').where('slug', slug).first();
    if (!course) throw new Error('Course not found');

    const modules = await DB.table('lms_modules')
      .where('course_id', course.id)
      .orderBy('sort_order', 'ASC')
      .get();

    for (const mod of modules) {
      mod.lessons = await DB.table('lms_lessons')
        .where('module_id', mod.id)
        .orderBy('sort_order', 'ASC')
        .get();
    }

    return { ...course, modules };
  }

  // ── Enrollment & Progress ───────────────────────────────────
  async enrollUser(userId, courseId) {
    const existing = await DB.table('lms_enrollments')
      .where('user_id', userId)
      .where('course_id', courseId)
      .first();

    if (existing) return existing;

    return Enrollment.create({
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date()
    });
  }

  async completeLesson(userId, lessonId) {
    const lesson = await Lesson.find(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    // Mark as completed
    await Progress.create({
      user_id: userId,
      lesson_id: lessonId,
      is_completed: 1,
      completed_at: new Date()
    });

    // Update overall course progress
    await this._updateCourseProgress(userId, lessonId);

    return { status: true };
  }

  async _updateCourseProgress(userId, lessonId) {
    // 1. Find course ID
    const lesson = await DB.table('lms_lessons')
      .join('lms_modules', 'lms_lessons.module_id', 'lms_modules.id')
      .where('lms_lessons.id', lessonId)
      .select('lms_modules.course_id')
      .first();

    if (!lesson) return;

    const courseId = lesson.course_id;

    // 2. Count total lessons in course
    const totalLessons = await DB.raw(`
      SELECT COUNT(*) as count FROM lms_lessons 
      JOIN lms_modules ON lms_lessons.module_id = lms_modules.id
      WHERE lms_modules.course_id = ?
    `, [courseId]);

    // 3. Count completed lessons by user in this course
    const completedLessons = await DB.raw(`
      SELECT COUNT(*) as count FROM lms_progress
      JOIN lms_lessons ON lms_progress.lesson_id = lms_lessons.id
      JOIN lms_modules ON lms_lessons.module_id = lms_modules.id
      WHERE lms_progress.user_id = ? AND lms_modules.course_id = ?
    `, [userId, courseId]);

    const total = totalLessons[0].count;
    const completed = completedLessons[0].count;
    const percent = Math.round((completed / total) * 100);

    // 4. Update enrollment
    await DB.table('lms_enrollments')
      .where('user_id', userId)
      .where('course_id', courseId)
      .update({
        progress_percent: percent,
        status: percent === 100 ? 'completed' : 'active',
        completed_at: percent === 100 ? new Date() : null
      });
  }
}

module.exports = new LmsService();
