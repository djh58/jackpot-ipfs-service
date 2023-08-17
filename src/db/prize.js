import { connect, close, db } from './mongoClient.js';
import { ObjectId } from 'mongodb';
import { updateRaffle, getRaffle } from './raffle.js';
/**
 * Schema for Prize is as follows:
 * created_at: datetime
 * raffle_id: ObjectId
 * drawing_id: ObjectId
 * paid: bool
 * token: str
 * amount: str
 */

export async function initializePrize(
    raffle_id,
    drawing_id,
    token,
    amount) {
    try {
        await connect(); // Connect to MongoDB

        const created_at = new Date();
        const paid = false;
        const doc_to_insert = {};
        if (raffle_id) {
            doc_to_insert.raffle_id = new ObjectId(raffle_id);
        }
        if (drawing_id) {
            doc_to_insert.drawing_id = new ObjectId(drawing_id);
        }
        if (token) {
            doc_to_insert.token = token;
        }
        if (amount) {
            doc_to_insert.amount = amount;
        }
        doc_to_insert.created_at = created_at;
        doc_to_insert.paid = paid;

        const res = await db.collection('prizes').insertOne(doc_to_insert);
        // if raffle_id is provided, update raffle with prize_id
        if (raffle_id) {
            const prize_id = res.insertedId;
            const raffle = await getRaffle(raffle_id);
            if (!raffle) {
                throw new Error("Raffle does not exist");
            }       
            let prize_ids = [];
            if (raffle.prize_ids) {
                prize_ids = raffle.prize_ids;
            }
            prize_ids.push(prize_id);
            await updateRaffle(raffle_id, null, null, prize_ids);
        }
    } catch (error) {
        console.error('Error in initializePrize:', error);
    } finally {
        await close(); // Close MongoDB connection when done
    }
}

export async function updatePrize(
    _id,
    raffle_id,
    drawing_id,
    token,
    amount,
    paid
) {
    try {
        await connect(); // Connect to MongoDB

        // convert _id to ObjectId
        const uid = new ObjectId(_id);
        const existingPrize = await db.collection('prizes').findOne(
            {_id: uid}
        );

        if (!existingPrize) {
            console.log("Prize does not exist");
            return;
        }

        const update_doc = {};

        if (raffle_id) {
            update_doc.raffle_id = new ObjectId(raffle_id);

            const old_raffle_id = existingPrize.raffle_id;
            if (old_raffle_id) {
                const oldRaffle = await getRaffle(old_raffle_id);
                if (!oldRaffle) {
                    throw new Error("Raffle does not exist");
                }
                const old_prize_ids = oldRaffle.prize_ids;
                const new_prize_ids = old_prize_ids.filter(id => id !== uid);
                await updateRaffle(old_raffle_id, null, null, new_prize_ids);
            }
            const raffle = await getRaffle(raffle_id);
            if (!raffle) {
                throw new Error("Raffle does not exist");
            }       
            let prize_ids = [];
            if (raffle.prize_ids) {
                prize_ids = raffle.prize_ids;
            }
            prize_ids.push(prize_id);
            await updateRaffle(raffle_id, null, null, prize_ids);
        }

        if (drawing_id) {
            update_doc.drawing_id = new ObjectId(drawing_id);
        }

        if (token) {
            update_doc.token = token;
        }

        if (amount) {
            update_doc.amount = amount;
        }

        if (paid) {
            update_doc.paid = paid;
        }

        await db.collection('prizes').updateOne(
            {_id: uid},
            {$set: update_doc}
        )

    } catch (error) {
        console.error('Error in updateRaffle:', error);
    } finally {
        await close(); // Close MongoDB connection when done
    }

}


export async function getPrize(id) {
    try {
        await connect(); // Connect to MongoDB

        // convert _id to ObjectId
        const uid = new ObjectId(id);
        const prize = await db.collection('prizes').findOne(
            {_id: uid}
        );
        return prize;

    } catch (error) {
        console.error('Error in getPrize:', error);
    } finally {
        await close(); // Close MongoDB connection when done
    }
}

export async function getPrizesFromRaffle(raffle_id) {
    // get all prizes with that raffle_id, and sort in descending order of amount 
    try {
        await connect(); // Connect to MongoDB
        const prizes = await db.collection('prizes').find(
            { raffle_id: new ObjectId(raffle_id) }
        ).toArray();

        // Convert the string amounts to numbers for sorting
        prizes.sort((a, b) => Number(b.amount) - Number(a.amount));
        return prizes;

    } catch (error) {
        console.error('Error in getPrizesFromRaffle:', error);
    }
    finally {
        await close(); // Close MongoDB connection when done
    }

}
