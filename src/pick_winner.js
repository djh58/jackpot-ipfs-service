import fs from 'fs';
import path from 'path';
import {client, connect, close} from './db/mongoClient.js';
import { updateDrawing } from './db/drawing.js';
// given a rawUint256 random number as BigNumber and a local path, find the winner
// and return the winner's address
function pickWinner(rawUintBigInt, localPath, drawing_id) {
    // read in the formattedWallets.json file
    const formattedWalletsPath = path.join(localPath, 'formattedWallets.json');
    const formattedWallets = JSON.parse(fs.readFileSync(formattedWalletsPath, 'utf8'));

    // read in the metadata.json file
    const metadataPath = path.join(localPath, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    // read the rawSnapshot.json file
    const rawSnapshotPath = path.join(localPath, 'rawSnapshot.json');
    const rawSnapshot = JSON.parse(fs.readFileSync(rawSnapshotPath, 'utf8'));

    const totalTickets = metadata.totalTickets;

    // rawUint is a bignumber. take the modulo of that and totalTickets + 1
    const winningTicket = rawUintBigInt % BigInt(totalTickets + 1);

    // to find the winner, iterate through each wallet in formatted wallets until we find one where:
    // lower <= winningTicket <= upper
    // make sure to convert the lower and upper bounds to bignumber

    for (const [id, wallet] of Object.entries(formattedWallets)) {
        const lowerBigInt = BigInt(wallet.lower)
        const upperBigInt = BigInt(wallet.upper)
        if (lowerBigInt <= winningTicket && winningTicket <= upperBigInt) {
            console.log(`winner found: ${wallet.address} ${id}`);
            // save id and address into file at that path called winner.json
            const winnerPath = path.join(localPath, 'winner.json');
            const winData = {
                id, 
                address: wallet.address,
                winningNumber: winningTicket.toString(),
                rawRandomNumber: rawUintBigInt.toString(),
                odds: wallet.odds,
                winnerUpperTicket: upperBigInt.toString(),
                winnerLowerTicket: lowerBigInt.toString(),
                winnerTicketCount: rawSnapshot[id].tickets,
            }
           
            updateDrawing(
                drawing_id, 
                null, 
                id, 
                null, 
                rawUintBigInt.toString(),
                winningTicket.toString(), 
                wallet.odds, 
                upperBigInt.toString(), 
                lowerBigInt.toString(), 
                rawSnapshot[id].tickets, 
                wallet.address);
            
            return;
        }
    }

    console.log("winner not found");
    return null;

}