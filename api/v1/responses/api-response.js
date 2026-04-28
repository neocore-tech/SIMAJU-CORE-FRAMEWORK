'use strict';

/**
 * Standard API Response Formatter (JSend standard)
 * ─────────────────────────────────────────────────────────────
 * success: All went well, and (usually) some data was returned.
 * fail: There was a problem with the data submitted, or some pre-condition of the API call wasn't satisfied.
 * error: An error occurred in processing the request, i.e. an exception was thrown.
 */

class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static fail(res, data = null, message = 'Fail', statusCode = 400) {
    return res.status(statusCode).json({
      status: 'fail',
      message,
      data
    });
  }

  static error(res, message = 'Internal Server Error', statusCode = 500) {
    return res.status(statusCode).json({
      status: 'error',
      message
    });
  }
}

module.exports = ApiResponse;
