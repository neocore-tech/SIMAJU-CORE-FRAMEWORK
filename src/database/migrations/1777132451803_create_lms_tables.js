'use strict';

/**
 * Migration: Create LMS Tables
 *
 * STATUS: COMING SOON
 * Modul src/modules/lms/ belum dibuat.
 * Migrasi ini siap dijalankan saat modul LMS tersedia.
 */
module.exports = {
  up: async (db) => {
    const conn = await db._resolveConnection(db.defaultConnection);
    const driver = conn.driver;
    const pk = driver === 'postgres' ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    const dt = driver === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

    // 1. Courses
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_courses (
        id ${pk},
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        thumbnail TEXT,
        instructor_id INTEGER,      -- user_id
        level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
        status TEXT DEFAULT 'draft',    -- draft, published, archived
        created_at ${dt},
        updated_at ${dt}
      )
    `);

    // 2. Modules (Chapters)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_modules (
        id ${pk},
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at ${dt},
        updated_at ${dt}
      )
    `);

    // 3. Lessons (Topics)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_lessons (
        id ${pk},
        module_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content_type TEXT,           -- video, pdf, text
        content_url TEXT,            -- youtube link, file path, or markdown
        body TEXT,                   -- for text lessons
        duration INTEGER DEFAULT 0,  -- in minutes
        sort_order INTEGER DEFAULT 0,
        is_preview BOOLEAN DEFAULT false,
        created_at ${dt},
        updated_at ${dt}
      )
    `);

    // 4. Enrollments (Siswa mendaftar kursus)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_enrollments (
        id ${pk},
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        progress_percent INTEGER DEFAULT 0,
        status TEXT DEFAULT 'enrolled', -- enrolled, active, completed
        enrolled_at ${dt},
        completed_at ${dt},
        UNIQUE(user_id, course_id)
      )
    `);

    // 5. User Progress (Per lesson)
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_progress (
        id ${pk},
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        is_completed BOOLEAN DEFAULT false,
        completed_at ${dt},
        UNIQUE(user_id, lesson_id)
      )
    `);

    // 6. Quizzes
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_quizzes (
        id ${pk},
        course_id INTEGER,
        lesson_id INTEGER,           -- Quiz can be standalone or part of a lesson
        title TEXT NOT NULL,
        passing_grade INTEGER DEFAULT 70,
        time_limit INTEGER DEFAULT 0, -- in minutes
        created_at ${dt}
      )
    `);

    // 7. Questions
    await db.raw(`
      CREATE TABLE IF NOT EXISTS lms_questions (
        id ${pk},
        quiz_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        type TEXT DEFAULT 'multiple_choice', -- multiple_choice, boolean, short_answer
        options TEXT,                -- JSON string for choices
        correct_answer TEXT,
        points INTEGER DEFAULT 1,
        created_at ${dt}
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
