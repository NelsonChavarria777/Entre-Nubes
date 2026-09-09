import { queryJSON, executeSQL } from './db.js';

async function test() {
  // Check current data
  console.log('=== Before delete ===');
  const before = await queryJSON('SELECT * FROM Clientes');
  console.log('Clientes:', before);

  // Try delete
  console.log('\n=== Deleting ClienteID = 1 ===');
  const result = await executeSQL('DELETE FROM Clientes WHERE ClienteID = 1;');
  console.log('Result:', result);

  // Check after
  console.log('\n=== After delete ===');
  const after = await queryJSON('SELECT * FROM Clientes');
  console.log('Clientes:', after);
}

test().catch(e => console.error('Error:', e));