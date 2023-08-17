import fs from 'fs';
import path from 'path';
import { web3StorageClient } from './web3Storage/client.js';
import { config } from 'dotenv';
import {client, connect, close} from './mongoClient.js';

// given a rawUint256 random number as BigNumber and a local path, find the winner
// and return the winner's address
function pickWinner(rawUintBigInt, localPath) {
    // read in the formattedWallets.json file
    const formattedWalletsPath = path.join(localPath, 'formattedWallets.json');
    const formattedWallets = JSON.parse(fs.readFileSync(formattedWalletsPath, 'utf8'));
    
    // read in the metadata.json file
    const metadataPath = path.join(localPath, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

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
                rawRandomNumber: rawUintBigInt.toString()
            }
            fs.writeFileSync(winnerPath, JSON.stringify(winData, null, 2));
            return;
        }
    }

    console.log("winner not found");
    return null;

}

async function save_winner_to_db(localPath) {
    // file at {localPath}/winner.json 

    // schema: 
     //{
        //   "id": ObjectId,
        //   "winner_address": str,
        //   "winning_number": str,
        //   "raw_random_number": str,
        //    "raffle_name": str,
        // "created_at": datetime
        // }

    const raffle_name = `ALPHA_TEST_LOW_FIDELITY`
    const winnerPath = path.join(localPath, 'winner.json');
    const winData = JSON.parse(fs.readFileSync(winnerPath, 'utf8'));
    const winner_address = winData.address;
    const winning_number = winData.winningNumber;
    const raw_random_number = winData.rawRandomNumber;
    const id = winData.id;

    const winner = {
        id,
        winner_address,
        winning_number,
        raw_random_number,
        raffle_name,
        created_at: new Date()
    }

    console.log(winner);

    // save winner to db

    try {
        // connect to db
        await connect();
        
        // check if winner already exists for raffle_name
        const existing_winner = await client.db('jackpot').collection('winners').findOne(
            {raffle_name}
        );
        if (existing_winner) {
            console.log("winner already exists for this raffle");
            return;
        }

        // insert winner into db
        await client.db('jackpot').collection('winners').insertOne(winner);
    
    } catch (error) {
        console.error('Error in save_winner_to_db:', error);
    } finally {
        await close(); // Close MongoDB connection when done
    }

}

