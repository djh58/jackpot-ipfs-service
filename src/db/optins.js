import { connect, close, db } from './mongoClient.js';
export async function get_all_users() {
    let users = [];
    try {
      await connect(); // Connect to MongoDB
      const cursor = db.collection('optins').find();
  
      await cursor.forEach(user => {
        users.push(user);
      });
    } catch (error) {
      console.error('Error in get_all_users:', error);
    } finally {
      await close(); // Close MongoDB connection when done
    }
    return users;
  }
