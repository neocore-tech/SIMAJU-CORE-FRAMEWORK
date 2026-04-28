'use strict';

const db = require('../../../config/database');

class RadiusService {
  /**
   * Insert user to FreeRADIUS tables (radcheck & radreply)
   */
  async createUser(username, password, profileName) {
    const trx = await db.transaction();
    try {
      // 1. Set Cleartext-Password in radcheck
      await trx('radcheck').insert({
        username: username,
        attribute: 'Cleartext-Password',
        op: '==',
        value: password
      });

      // 2. Set Framed-Protocol for PPPoE (Optional, good practice)
      await trx('radreply').insert({
        username: username,
        attribute: 'Framed-Protocol',
        op: '=',
        value: 'PPP'
      });

      // 3. Assign Mikrotik-Group or generic Rate-Limit if profile is used
      await trx('radreply').insert({
        username: username,
        attribute: 'Mikrotik-Group',
        op: '=',
        value: profileName
      });

      await trx.commit();
      return { username, profile: profileName };
    } catch (error) {
      await trx.rollback();
      throw new Error(`RADIUS DB Error: ${error.message}`);
    }
  }

  async suspendUser(username) {
    // Change password or assign to "Isolir" pool
    await db('radreply')
      .where({ username: username, attribute: 'Mikrotik-Group' })
      .update({ value: 'ISOLIR_PROFILE' });
      
    return true;
  }
}

module.exports = new RadiusService();
