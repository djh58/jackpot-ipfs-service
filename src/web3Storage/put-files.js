import { getFilesFromPath } from 'web3.storage'
import {web3StorageClient} from './client.js';

export async function uploadFilesFromPath(path) {
  const pathFiles = await getFilesFromPath(path);
  console.log(`Uploading ${pathFiles.length} files`)
  const cid = await web3StorageClient.put(pathFiles, {
    wrapWithDirectory: false,
  });
  console.log('Content added with CID:', cid);
  return cid;
}

