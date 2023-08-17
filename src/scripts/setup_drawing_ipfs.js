import { get_all_users } from '../db/optins.js';
import { createDrawingFiles } from '../services/createDrawingFiles.js';
import {uploadFilesFromPath} from '../web3Storage/put-files.js';
import { initializeDrawing } from '../db/drawing.js';
import { getPrizesFromRaffle } from '../db/prize.js';
async function main() {
  try {
    const RAFFLE_ID = "64de48e1df0e3f8fea8e88b9";
    const prizes = await getPrizesFromRaffle(RAFFLE_ID, true);
    if (!prizes || prizes.length === 0) {
      console.log("No prizes found");
      return;
    }
    const prize_id = prizes[0]._id.toString();
    console.log(`Prize id: ${prize_id} - amount: ${prizes[0].amount} - token: ${prizes[0].token}`);
    const exclude_winners = true;
    const users = await get_all_users(exclude_winners);
    const path = await createDrawingFiles(users, prize_id);
    const cid = await uploadFilesFromPath(path);
    const drawing = await initializeDrawing(prize_id, null, cid);
    console.log("Drawing created at: ", drawing.insertedId);

  } catch (error) {
    console.error('Error in main:', error);
  }
}

main();
