import process from 'process'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { config } from 'dotenv';
import {web3StorageClient} from './client.js';
import fs from 'fs';
import path from 'path';

export async function retrieve (cid) {
    const client = web3StorageClient;
    const res = await client.get(cid)
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`)
    }
  
    // unpack File objects from the response
    const outputDir = path.join('out', cid);
    fs.mkdirSync(outputDir, { recursive: true });
    const files = await res.files()
        for (const file of files) {
            const humanReadableName = file.name;
            // save each to {outputDir}/{humanReadableName}.json 
            const filePath = path.join(outputDir, humanReadableName);
            const fileContents = await file.arrayBuffer();
            fs.writeFileSync(filePath, Buffer.from(fileContents));
        }
    return outputDir;
  }