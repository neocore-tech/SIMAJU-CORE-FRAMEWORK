'use strict';

/**
 * Migration: Create LMS Tables
 */
module.exports = {
  up: async (db) => {
    // 1. Courses
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        thumbnail TEXT,
        instructor_id INTEGER,      -- user_id
        level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
        status TEXT DEFAULT 'draft',    -- draft, published, archived
        created_at DATETIME,
        updated_at DATETIME
      )
    `);

    // 2. Modules (Chapters)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME,
        updated_at DATETIME
      )
    `);

    // 3. Lessons (Topics)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content_type TEXT,           -- video, pdf, text
        content_url TEXT,            -- youtube link, file path, or markdown
        body TEXT,                   -- for text lessons
        duration INTEGER DEFAULT 0,  -- in minutes
        sort_order INTEGER DEFAULT 0,
        is_preview BOOLEAN DEFAULT 0,
        created_at DATETIME,
        updated_at DATETIME
      )
    `);

    // 4. Enrollments (Siswa mendaftar kursus)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        progress_percent INTEGER DEFAULT 0,
        status TEXT DEFAULT 'enrolled', -- enrolled, active, completed
        enrolled_at DATETIME,
        completed_at DATETIME,
        UNIQUE(user_id, course_id)
      )
    `);

    // 5. User Progress (Per lesson)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        is_completed BOOLEAN DEFAULT 0,
        completed_at DATETIME,
        UNIQUE(user_id, lesson_id)
      )
    `);

    // 6. Quizzes
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        lesson_id INTEGER,           -- Quiz can be standalone or part of a lesson
        title TEXT NOT NULL,
        passing_grade INTEGER DEFAULT 70,
        time_limit INTEGER DEFAULT 0, -- in minutes
        created_at DATETIME
      )
    `);

    // 7. Questions
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        type TEXT DEFAULT 'multiple_choice', -- multiple_choice, boolean, short_answer
        options TEXT,                -- JSON string for choices
        correct_answer TEXT,
        points INTEGER DEFAULT 1,
        created_at DATETIME
      )
    `);
  },

  down: async (db) => {
    await db.raw('DROP TABLE IF EXISTS lms_questions');
    await db.raw('DROP TABLE IF EXISTS lms_quizzes');
    await db.raw('DROP TABLE IF EXISTS lms_progress');
    await db.raw('DROP TABLE IF EXISTS lms_enrollments');
    await db.raw('DROP TABLE IF EXISTS lms_lessons');
    await db.raw('DROP TABLE IF EXISTS lms_modules');
    await db.raw('DROP TABLE IF EXISTS lms_courses');
  }
};
