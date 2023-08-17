import process from 'process'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { config } from 'dotenv';
import {web3StorageClient} from './client.js';

config(); // Load environment variables from .env file

async function main () {
  const args = minimist(process.argv.slice(2))
  
  const files = []

  for (const path of args._) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  console.log(`Uploading ${files.length} files`)
  const cid = await web3StorageClient.put(files, {
    wrapWithDirectory: false,
  })
  console.log('Content added with CID:', cid)
}

main()
