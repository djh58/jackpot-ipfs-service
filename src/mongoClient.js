import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config(); // Load environment variables from .env file
// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI;

export const client = new MongoClient(uri);
export const db = client.db('jackpot');

export async function connect() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  
  export async function close() {
    try {
      await client.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
  
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
