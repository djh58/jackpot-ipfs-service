import { connect, close, db } from './mongoClient.js';
import { ObjectId } from 'mongodb';
export async function get_all_users(exclude_winners) {
    let users = [];
    try {
      await connect(); // Connect to MongoDB
      const cursor = db.collection('optins').find();
  
      await cursor.forEach(user => {
        users.push(user);
      });

      if (exclude_winners) {
        // query all drawings where winner_id is not null, and for each winner_id, remove that user from list

        const cursor = db.collection('drawings').find({winner_id: {$ne: null}});
        await cursor.forEach(drawing => {
            const winner_id = drawing.winner_id;
            users = users.filter(user => user._id.toString() !== winner_id.toString());
            }
        );

      } 

    } catch (error) {
      console.error('Error in get_all_users:', error);
    } finally {
      await close(); // Close MongoDB connection when done
    }
    return users;
  }


  export async function getUser(uid) {
    try {
        await connect(); // Connect to MongoDB

        // convert _id to ObjectId
        const id = new ObjectId(uid);
        const user = await db.collection('optins').findOne(
            {_id: id}
        );
        return user;

    } catch (error) {
        console.error('Error in getUser:', error);

    } finally {
        await close(); // Close MongoDB connection when done

    }
  }