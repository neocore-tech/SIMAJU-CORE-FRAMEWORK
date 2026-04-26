'use strict';

/**
 * Production Logger
 * ─────────────────────────────────────────────────────────────
 * Menggunakan pino — logger tercepat untuk Node.js.
 *
 * - Development  : format pretty (berwarna, mudah dibaca)
 * - Production   : format JSON (mudah diparse oleh log aggregator)
 * - Level        : dikontrol via LOG_LEVEL env (default: 'info')
 *
 * Usage:
 *   const logger = require('./src/utils/logger');
 *   logger.info('Server started');
 *   logger.warn({ query, ms }, 'Slow query detected');
 *   logger.error({ err }, 'Connection failed');
 */

const pino = require('pino');

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  // Format timestamp yang mudah dibaca
  timestamp: pino.stdTimeFunctions.isoTime,

  // Serializer error standar
  serializers: {
    err: pino.stdSerializers.err,
  },

  // Pretty print di development
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize:        true,
          translateTime:   'SYS:HH:MM:ss',
          ignore:          'pid,hostname',
          messageFormat:   '{msg}',
          singleLine:      false,
        },
      }
    : undefined,
});

module.exports = logger;
