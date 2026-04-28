const DB = require('./src/database');
const config = require('./src/config/database');

async function test() {
  await DB.boot(config);
  const conn = await DB._resolveConnection(DB.defaultConnection);
  console.log('Default Connection:', DB.defaultConnection);
  console.log('Driver:', conn.driver);
  process.exit(0);
}

test();
