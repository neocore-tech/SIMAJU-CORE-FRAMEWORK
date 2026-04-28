'use strict';

const { RouterOSClient } = require('routeros-client');

class MikrotikService {
  async connect(routerConfig) {
    const api = new RouterOSClient({
      host: routerConfig.ip_address,
      user: routerConfig.api_user,
      password: routerConfig.api_password,
      port: routerConfig.api_port || 8728,
      keepalive: true
    });

    return await api.connect();
  }

  async getActiveUsers(routerConfig) {
    let client = null;
    try {
      client = await this.connect(routerConfig);
      
      // Get PPPoE Active Users
      const pppoeMenu = client.menu('/ppp active');
      const pppoeUsers = await pppoeMenu.get();

      // Get Hotspot Active Users
      const hotspotMenu = client.menu('/ip hotspot active');
      const hotspotUsers = await hotspotMenu.get();

      return {
        pppoe: pppoeUsers,
        hotspot: hotspotUsers
      };
    } catch (error) {
      throw new Error(`MikroTik API Error: ${error.message}`);
    } finally {
      if (client) client.close();
    }
  }

  async kickUser(routerConfig, username) {
    let client = null;
    try {
      client = await this.connect(routerConfig);
      const pppoeMenu = client.menu('/ppp active');
      const users = await pppoeMenu.where('name', username).get();
      
      if (users.length > 0) {
        await pppoeMenu.remove(users[0]['.id']);
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(`MikroTik API Error: ${error.message}`);
    } finally {
      if (client) client.close();
    }
  }
}

module.exports = new MikrotikService();
