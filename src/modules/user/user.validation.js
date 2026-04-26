'use strict';

const Response = require('../../utils/response');

/**
 * User Validation (Bab 2, 11 & 31)
 * ─────────────────────────────────────────────────────────────
 */
class UserValidation {
  static updateProfile(req, res, next) {
    const { nama_lengkap, nomor_hp } = req.body;
    const errors = {};

    if (!nama_lengkap) errors.nama_lengkap = 'Name is required';
    if (!nomor_hp) errors.nomor_hp = 'Phone number is required';

    if (Object.keys(errors).length > 0) {
      return Response.error(res, 'Validation Error', 422, errors);
    }

    next();
  }

  static updateKtp(req, res, next) {
    const { nik, nama_sesuai_ktp, alamat_lengkap } = req.body;
    const errors = {};

    if (!nik) errors.nik = 'NIK is required';
    if (nik && nik.length !== 16) errors.nik = 'NIK must be 16 digits';
    if (!nama_sesuai_ktp) errors.nama_sesuai_ktp = 'Name as per KTP is required';
    if (!alamat_lengkap) errors.alamat_lengkap = 'Full address is required';

    if (Object.keys(errors).length > 0) {
      return Response.error(res, 'Validation Error', 422, errors);
    }

    next();
  }
}

module.exports = UserValidation;
