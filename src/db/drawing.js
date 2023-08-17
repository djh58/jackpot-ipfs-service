import { connect, close, db } from './mongoClient.js';
import { ObjectId } from 'mongodb';
import { updatePrize, getPrize } from './prize.js';

/**
 * Schema for Drawing is as follows:
 * created_at: datetime
 * prize_id: ObjectId
 * winner_id: ObjectId
 * ipfs_hash: str
 * vrf_request_id: str
 * raw_random_number: str
 * winning_number: str
 * winner_odds: str
 * winner_upper_ticket: str
 * winner_lower_ticket: str
 * winner_ticket_count: str
 * winner_eth_address: str
 */

export async function initializeDrawing(
    prize_id,
    winner_id,
    ipfs_hash,
    vrf_request_id,
    raw_random_number,
    winning_number,
    winner_odds,
    winner_upper_ticket,
    winner_lower_ticket,
    winner_ticket_count,
    winner_eth_address
    ) {
    try {
        await connect(); // Connect to MongoDB

        const created_at = new Date();
        const doc_to_insert = {};

        if (prize_id) {
            doc_to_insert.prize_id = new ObjectId(prize_id);
        }
        if (winner_id) {
            doc_to_insert.winner_id = new ObjectId(winner_id);
        }
        if (ipfs_hash) {
            doc_to_insert.ipfs_hash = ipfs_hash;
        }
        if (vrf_request_id) {
            doc_to_insert.vrf_request_id = vrf_request_id;
        }
        if (raw_random_number) {
            doc_to_insert.raw_random_number = raw_random_number;
        }
        if (winning_number) {
            doc_to_insert.winning_number = winning_number;
        }
        if (winner_odds) {
            doc_to_insert.winner_odds = winner_odds;
        }
        if (winner_upper_ticket) {
            doc_to_insert.winner_upper_ticket = winner_upper_ticket;
        }
        if (winner_lower_ticket) {
            doc_to_insert.winner_lower_ticket = winner_lower_ticket;
        }
        if (winner_ticket_count) {
            doc_to_insert.winner_ticket_count = winner_ticket_count;
        }
        if (winner_eth_address) {
            doc_to_insert.winner_eth_address = winner_eth_address;
        }


        doc_to_insert.created_at = created_at;

        const res = await db.collection('drawings').insertOne(doc_to_insert);
        // if prize_id is provided, update prize with drawing_id
        if (prize_id) {
            const drawing_id = res.insertedId;
            const prize = await getPrize(prize_id);
            if (!prize) {
                throw new Error("Prize does not exist");
            }       
            await updatePrize(prize_id, null, drawing_id);
        }

        return res;

    } catch (error) {
        console.error('Error in initializeDrawing:', error);

    } finally {
        await close(); // Close MongoDB connection when done
    }
    
}

export async function updateDrawing(
    _id,
    prize_id,
    winner_id,
    ipfs_hash,
    vrf_request_id,
    raw_random_number,
    winning_number,
    winner_odds,
    winner_upper_ticket,
    winner_lower_ticket,
    winner_ticket_count,
    winner_eth_address
) {
    try {
        await connect(); // Connect to MongoDB

        // convert _id to ObjectId
        const uid = new ObjectId(_id);
        const existingDrawing = await db.collection('drawings').findOne(
            {_id: uid}
        );

        if (!existingDrawing) {
            console.log("Drawing does not exist");
            return;

        }

        const update_doc = {};

        

        if (winner_id) {
            update_doc.winner_id = new ObjectId(winner_id);

        }
        if (prize_id) {
            update_doc.prize_id = new ObjectId(prize_id);
        }

        if (ipfs_hash) {
            update_doc.ipfs_hash = ipfs_hash;

        }

        if (vrf_request_id) {
            update_doc.vrf_request_id = vrf_request_id;
        }

        if (raw_random_number) {

            update_doc.raw_random_number = raw_random_number;

        }

        if (winning_number) {

            update_doc.winning_number = winning_number;

        }

        if (winner_odds) {
            update_doc.winner_odds = winner_odds;
        }

        if (winner_upper_ticket) {
            update_doc.winner_upper_ticket = winner_upper_ticket;
        }

        if (winner_lower_ticket) {
            update_doc.winner_lower_ticket = winner_lower_ticket;
        }

        if (winner_ticket_count) {
            update_doc.winner_ticket_count = winner_ticket_count;
        }

        if (winner_eth_address) {
            update_doc.winner_eth_address = winner_eth_address;
        }


        await db.collection('drawings').updateOne(
            {_id: uid},
            {$set: update_doc}
        )

        if (prize_id) {
           
            const old_prize_id = existingDrawing.prize_id;
            if (old_prize_id) {
                const old_prize = await getPrize(old_prize_id);
                if (!old_prize) {
                    throw new Error("Prize does not exist");
                }
                console.log(`you need to remove the drawing_id from the old prize_id ${old_prize_id}`);
            }
            await updatePrize(prize_id, null, _id);

        }

    } catch (error) {
        console.error('Error in updateDrawing:', error);

    } finally {
        await close(); // Close MongoDB connection when done

    }

}

export async function getDrawing(id) {
    try {
        await connect(); // Connect to MongoDB

        // convert _id to ObjectId
        const uid = new ObjectId(id);
        const drawing = await db.collection('drawings').findOne(
            {_id: uid}
        );
        return drawing;

    } catch (error) {
        console.error('Error in getDrawing:', error);

    } finally {
        await close(); // Close MongoDB connection when done

    }

}