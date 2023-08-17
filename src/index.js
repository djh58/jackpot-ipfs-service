import { connect, close } from './db/mongoClient.js';
import { get_all_users } from './db/optins.js';
import { createRaffleFiles } from './createRaffleFiles.js';

async function main() {
  try {
    const users = await get_all_users();
    createRaffleFiles(users, 'test');
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main();
