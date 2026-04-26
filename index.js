const { validateEnv, env } = require('./src/config/env');
const logger = require('./src/utils/logger');
const DB = require('./src/database');
const dbConfig = require('./src/config/database');
const app = require('./src/core/app');
const scheduler = require('./src/core/scheduler');
const path = require('path');

/**
 * Simaju Framework — Production Entry Point
 * ─────────────────────────────────────────────────────────────
 */

async function bootstrap() {
  // ── Show Branding ────────────────────────────────────────────
  try {
    const fs = require('fs');
    const branding = fs.readFileSync(path.join(__dirname, 'name.txt'), 'utf8');
    console.log(`\x1b[36m${branding}\x1b[0m`);
    console.log(' \x1b[1m\x1b[35mSIMAJU CORE FRAMEWORK\x1b[0m\n');
  } catch (e) {
    // Fallback if file not found
    console.log('SIMAJU CORE FRAMEWORK');
  }

  // ── 1. Validate Environment ──────────────────────────────────

  // ── 1. Validate Environment ──────────────────────────────────
  try {
    validateEnv();
    logger.info('[App] Environment validated');
  } catch (err) {
    console.error(`\n❌ CONFIG ERROR: ${err.message}\n`);
    process.exit(1);
  }

  // ── 2. Boot Database ────────────────────────────────────────
  await DB.boot(dbConfig);

  // ── 3. Start Server ─────────────────────────────────────────
  const server = app.listen(env.port, () => {
    logger.info(`🚀 Server running on port ${env.port} [${env.nodeEnv}]`);
  });

  // ── 4. Graceful Shutdown ─────────────────────────────────────
  const shutdown = async (signal) => {
    logger.info(`[App] Received ${signal}. Starting graceful shutdown...`);
    
    // Stop accepting new requests
    server.close(async () => {
      logger.info('[App] HTTP server closed');
      
      // Close DB connections
      try {
        await DB.disconnect();
        logger.info('[App] Database connections closed');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, '[App] Error during DB disconnect');
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('[App] Force shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

// ── 5. Unhandled Exceptions ────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason }, 'Unhandled Rejection');
  // In production, you might want to shutdown gracefully
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught Exception');
  process.exit(1);
});

bootstrap().catch(err => {
  logger.error({ err }, 'Bootstrap Failed');
  process.exit(1);
});
