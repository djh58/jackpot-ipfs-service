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
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  
  export async function close() {
    try {
      await client.close();
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
  
