'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Error Preview Utility
 * ─────────────────────────────────────────────────────────────
 * Mengekstrak potongan kode dari stack trace untuk ditampilkan di UI.
 */
class ErrorPreview {
  /**
   * Mendapatkan detail error termasuk snippet kode.
   * @param {Error} err 
   */
  static getDetails(err) {
    const stack = err.stack || '';
    const lines = stack.split('\n');
    
    // Cari frame pertama yang berasal dari aplikasi (bukan node_modules atau internal node)
    const appFrame = lines.find(line => 
      line.includes('/src/') && 
      !line.includes('node_modules') && 
      !line.includes('node:internal')
    ) || lines[1]; // Fallback ke frame pertama setelah pesan error jika tidak ketemu

    if (!appFrame) {
      return {
        message: err.message,
        stack: err.stack,
        file: null,
        line: null,
        snippet: null
      };
    }

    // Ekstrak file dan line
    // Mendukung format: "(/path/file.js:10:5)" atau "at /path/file.js:10:5"
    const match = appFrame.match(/(\/.*):(\d+):(\d+)/);
    
    if (!match) {
      return {
        message: err.message,
        stack: err.stack,
        file: null,
        line: null,
        snippet: null
      };
    }

    const filePath = match[1];
    const lineNumber = parseInt(match[2], 10);
    const snippet = this._getSnippet(filePath, lineNumber);

    return {
      message: err.message,
      stack: err.stack,
      file: filePath.replace(process.cwd(), ''),
      fullPath: filePath,
      line: lineNumber,
      column: parseInt(match[3], 10),
      snippet
    };
  }

  /**
   * Membaca file dan mengambil beberapa baris di sekitar error.
   */
  static _getSnippet(filePath, line, context = 5) {
    try {
      if (!fs.existsSync(filePath)) return null;
      
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      const start = Math.max(0, line - context - 1);
      const end = Math.min(lines.length, line + context);
      
      return lines.slice(start, end).map((content, index) => ({
        number: start + index + 1,
        content: content,
        isErrorLine: (start + index + 1) === line
      }));
    } catch (err) {
      return null;
    }
  }
}

module.exports = ErrorPreview;
