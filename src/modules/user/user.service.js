'use strict';

const DB = require('../../database');

/**
 * User Service (Bab 2)
 * ─────────────────────────────────────────────────────────────
 */
class UserService {
  /**
   * Ambil Detail User
   */
  async getProfile(userId) {
    const user = await DB.table('users').find(userId);
    if (!user) throw new Error('User not found');
    
    // Jangan kirim password
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Update Profil
   */
  async updateProfile(userId, data) {
    const { nama_lengkap, nomor_hp, alamat, jenis_kelamin, tanggal_lahir } = data;

    await DB.table('users').where('id', userId).update({
      name: nama_lengkap,
      phone: nomor_hp,
      address: alamat,
      gender: jenis_kelamin,
      birth_date: tanggal_lahir,
      updated_at: new Date()
    });

    return this.getProfile(userId);
  }

  /**
   * Update Data KTP
   */
  async updateKtp(userId, data) {
    const { 
      nik, nama_sesuai_ktp, tempat_lahir, tanggal_lahir, 
      alamat_lengkap, rt_rw, kelurahan, kecamatan, 
      agama, status_perkawinan, pekerjaan 
    } = data;

    // Simpan ke tabel ktp_data (relasi 1:1)
    const existing = await DB.table('ktp_data').where('user_id', userId).first();
    
    const ktpData = {
      nik,
      full_name: nama_sesuai_ktp,
      birth_place: tempat_lahir,
      birth_date: tanggal_lahir,
      address: alamat_lengkap,
      rt_rw,
      subdistrict: kelurahan,
      district: kecamatan,
      religion: agama,
      marital_status: status_perkawinan,
      occupation: pekerjaan,
      updated_at: new Date()
    };

    if (existing) {
      await DB.table('ktp_data').where('user_id', userId).update(ktpData);
    } else {
      await DB.table('ktp_data').insert({ ...ktpData, user_id: userId, created_at: new Date() });
    }

    return ktpData;
  }
}

module.exports = new UserService();
