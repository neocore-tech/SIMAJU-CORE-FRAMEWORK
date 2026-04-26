'use strict';

const EventEmitter = require('events');

/**
 * Global Event Bus (Bab 10)
 * ─────────────────────────────────────────────────────────────
 * Digunakan untuk sistem hook / plugin.
 */
class EventBus extends EventEmitter {
  emit(event, ...args) {
    super.emit(event, ...args);
  }
}

module.exports = new EventBus();
