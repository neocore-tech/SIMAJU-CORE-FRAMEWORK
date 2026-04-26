'use strict';

const logger = require('../utils/logger');
const ErrorPreview = require('../utils/error-preview');
const { DatabaseError } = require('../database/errors');

/**
 * Global Error Handler Middleware
 * ─────────────────────────────────────────────────────────────
 */
module.exports = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Log error
  logger.error({ err }, 'Unhandled Error');

  // Di tahap development, kita tampilkan Pretty Error Page kecuali jika request via AJAX/JSON
  const isAjax = req.xhr || (req.headers.accept && req.headers.accept.includes('json')) || req.path.startsWith('/api');
  
  // Manual check query param jika req.query belum terpopulasi
  const url = new URL(req.url, `http://${req.headers.host}`);
  const forcePretty = url.searchParams.get('pretty') === 'true' || req.query?.pretty === 'true';

  if (isDev && (!isAjax || forcePretty)) {
    const details = ErrorPreview.getDetails(err);
    res.setHeader('Content-Type', 'text/html');
    return res.status(500).send(renderPrettyError(details));
  }

  // Jika request mengharapkan JSON (API) atau bukan dari browser
  if (isAjax) {
    return res.status(500).json({
      error: err instanceof DatabaseError ? 'Database Error' : 'Internal Server Error',
      message: isDev ? err.message : 'Something went wrong',
      code: err.code,
      stack: isDev ? err.stack : undefined
    });
  }

  // Default Production Error Page (Sederhana)
  res.status(500).send(`
    <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc;">
      <div style="text-align: center; max-width: 500px; padding: 20px;">
        <h1 style="color: #1e293b; margin-bottom: 8px;">500</h1>
        <p style="color: #64748b; font-size: 18px;">Oops! Sesuatu yang salah terjadi di server kami.</p>
        <a href="/" style="display: inline-block; margin-top: 16px; color: #3b82f6; text-decoration: none; font-weight: 500;">Kembali ke Beranda</a>
      </div>
    </body>
  `);
};

/**
 * Render HTML untuk Pretty Error Page (Laravel-style)
 */
function renderPrettyError(d) {
  const snippetHtml = d.snippet ? d.snippet.map(s => `
    <div class="line ${s.isErrorLine ? 'error-line' : ''}">
      <span class="line-number">${s.number}</span>
      <span class="line-content">${escapeHtml(s.content)}</span>
    </div>
  `).join('') : '<p style="padding: 20px; color: #94a3b8;">Snippet kode tidak tersedia.</p>';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error: ${escapeHtml(d.message)}</title>
      <style>
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --muted: #94a3b8; --error: #ef4444; --accent: #3b82f6; }
        body { background: var(--bg); color: var(--text); font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 20px; line-height: 1.5; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { margin-bottom: 24px; padding: 24px; background: var(--card); border-radius: 12px; border-left: 6px solid var(--error); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        h1 { margin: 0 0 12px 0; font-size: 24px; color: var(--error); }
        .file-info { font-family: monospace; font-size: 14px; color: var(--muted); }
        .code-card { background: var(--card); border-radius: 12px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
        .code-header { background: #0f172a; padding: 12px 20px; font-size: 13px; color: var(--muted); border-bottom: 1px solid #334155; display: flex; justify-content: space-between; }
        .code-body { padding: 0; font-family: 'Fira Code', 'Cascadia Code', monospace; font-size: 14px; overflow-x: auto; }
        .line { display: flex; white-space: pre; }
        .line:hover { background: #334155; }
        .line-number { width: 50px; text-align: right; padding-right: 20px; color: #475569; user-select: none; background: #0f172a; }
        .line-content { padding-left: 10px; }
        .error-line { background: #450a0a !important; position: relative; }
        .error-line::after { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--error); }
        .stack-card { background: var(--card); border-radius: 12px; padding: 24px; }
        h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
        pre { margin: 0; font-size: 13px; color: #cbd5e1; overflow-x: auto; white-space: pre-wrap; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>${escapeHtml(d.message)}</h1>
          <div class="file-info">${d.file ? `Terjadi di: <strong>${d.file}</strong> pada baris <strong>${d.line}</strong>` : 'Lokasi tidak diketahui'}</div>
        </header>

        <div class="code-card">
          <div class="code-header">
            <span>${d.fullPath || 'Source Code'}</span>
            <span>JavaScript</span>
          </div>
          <div class="code-body">
            ${snippetHtml}
          </div>
        </div>

        <div class="stack-card">
          <h2>Stack Trace</h2>
          <pre>${escapeHtml(d.stack)}</pre>
        </div>
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
