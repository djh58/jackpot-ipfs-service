import process from 'process'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { config } from 'dotenv';

config(); // Load environment variables from .env file
  
const token = process.env.WEB3_STORAGE_API_KEY

export const web3StorageClient = new Web3Storage({ token })