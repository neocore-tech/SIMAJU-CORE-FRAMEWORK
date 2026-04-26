'use strict';

const DB = require('../../database');
const Hash = require('../../utils/hash');
const jwt = require('jsonwebtoken');
const { QueryError } = require('../../database/errors');

/**
 * Auth Service (Bab 1 & 11)
 * ─────────────────────────────────────────────────────────────
 * Menangani logic bisnis autentikasi.
 */
class AuthService {
  /**
   * Register User Baru
   * @param {Object} data 
   */
  async register(data) {
    const { nama_lengkap, email, password, nomor_hp } = data;

    // Cek email duplikat
    const existing = await DB.table('users').where('email', email).first();
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await Hash.make(password);

    // Proses Simpan
    const result = await DB.table('users').insert({
      name: nama_lengkap,
      email,
      password: hashedPassword,
      phone: nomor_hp,
      created_at: new Date(),
      updated_at: new Date()
    });

    return { id: result.insertId || result._id, email };
  }

  /**
   * Login User
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    const user = await DB.table('users').where('email', email).first();
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await Hash.check(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id || user._id, email: user.email },
      process.env.JWT_SECRET || 'secret_simaju',
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email
      }
    };
  }

  /**
   * Request Reset Password (OTP/Token via Email)
   */
  async requestPasswordReset(email) {
    const user = await DB.table('users').where('email', email).first();
    if (!user) throw new Error('User not found');

    const token = Math.random().toString(36).substring(2, 8).toUpperCase(); // Simple OTP
    
    // Simpan token ke DB (biasanya ada tabel password_resets)
    // Untuk demo, kita log saja
    const Comm = require('../communication/communication.service');
    await Comm.sendEmail(email, 'Reset Password Simaju', `Kode OTP Anda adalah: ${token}`);
    
    return { status: true, message: 'OTP sent to email' };
  }
}

module.exports = new AuthService();
