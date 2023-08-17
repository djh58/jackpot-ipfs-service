import { connect, close, db } from './mongoClient.js';
import { ObjectId } from 'mongodb';
/**
 * Schema for Raffle is as follows:
 * created_at: datetime
 * name: str
 * description: str
 * prize_ids: [ObjectId]
 */

export async function initializeRaffle(
  name,
  description,
) {
  try {
    await connect(); // Connect to MongoDB

    const raffle = {
      name,
      description,
      created_at: new Date()
    }

    return await db.collection('raffles').insertOne(raffle);
  } catch (error) {
    console.error('Error in initializeRaffle:', error);
  } finally {
    await close(); // Close MongoDB connection when done
  }
}

export async function updateRaffle(
    _id,
    name,
    description,
    prize_ids
) {
    try {
        await connect(); // Connect to MongoDB

        // convert _id to ObjectId
        const uid = new ObjectId(_id);
        const existingRaffle = await db.collection('raffles').findOne(
            {_id: uid}
        );

        const update_doc = {};

        if (!existingRaffle) {
            console.log("Raffle does not exist");
            return;
        } 

        if (name) {
            update_doc.name = name;
        }

        if (description) {
            update_doc.description = description;
        }

        if (prize_ids) {
            // convert prize_ids to ObjectIds
            prize_ids = prize_ids.map(id => new ObjectId(id));
            update_doc.prize_ids = prize_ids;
        }

        await db.collection('raffles').updateOne(
            {_id: uid},
            {$set: update_doc}
        )

    } catch (error) {
        console.error('Error in updateRaffle:', error);
    } finally {
        await close(); // Close MongoDB connection when done
    }
}

export async function getRaffle(id) {
    try {
        await connect(); // Connect to MongoDB

        // convert _id to ObjectId
        const uid = new ObjectId(id);
        const raffle = await db.collection('raffles').findOne(
            {_id: uid}
        );
        return raffle;
    } catch (error) {
        console.error('Error in getRaffle:', error);
    } finally {
        await close(); // Close MongoDB connection when done
    }
}