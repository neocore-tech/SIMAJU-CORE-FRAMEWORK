const DB = require('./src/database');
const config = require('./src/config/database');

async function seed() {
  await DB.boot(config);
  
  try {
    console.log('Seeding items...');
    const items = [
      { name: 'Kertas A4 80gr', sku: 'PPR-A4-80', stock: 100, category: 'Alat Tulis Kantor' },
      { name: 'Tinta Printer Epson Black', sku: 'INK-EPS-BLK', stock: 25, category: 'Alat Tulis Kantor' },
      { name: 'Laptop Dell Latitude', sku: 'LTP-DEL-LAT', stock: 5, category: 'Elektronik' },
      { name: 'Mouse Wireless Logi', sku: 'MOU-LOG-WIR', stock: 15, category: 'Elektronik' }
    ];

    for (const item of items) {
      await DB.table('items').insert(item);
    }
    console.log('✅ Seeding completed!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await DB.disconnect();
  }
}

seed();
