import { getDrawing } from '../db/drawing.js';
import {pickWinner} from '../services/pickWinner.js';
import { retrieve } from '../web3Storage/retrieve.js';
import { getVrfRequestIdFromDrawingId, getRandomNumberDrawnFromDrawingId } from '../services/smartContract.js';


async function main() {
  try {
    // prompt user for drawing_oid and drawind_id from smart contract
    const drawing_oid = process.argv[2];
    if (!drawing_oid) {
      console.log("Please provide a drawing_id");
      return;
    }

    const drawing_smart_contract_id = process.argv[3];
    if (!drawing_smart_contract_id) {
      console.log("Please provide id from smart contract for drawing");
      return;
    }


    const drawing = await getDrawing(drawing_oid);
    if (!drawing) {
      console.log("Drawing not found");
      return;
    }
    if (!drawing.ipfs_hash) {
        console.log("Drawing does not have an ipfsHash");
        return;
    }
    const drawing_cid = drawing.ipfs_hash;
    const drawing_files_path = await retrieve(drawing_cid);
    console.log("Drawing files retrieved to: ", drawing_files_path)
    const vrfRequestIdBigInt = await getVrfRequestIdFromDrawingId(drawing_smart_contract_id);
    const randomNumberBigInt = await getRandomNumberDrawnFromDrawingId(drawing_smart_contract_id);

    await pickWinner(
        randomNumberBigInt,
        vrfRequestIdBigInt,
        drawing_files_path,
        drawing_oid
    )
    
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main();
