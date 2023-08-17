import { connect, close, db } from './mongoClient.js';
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
