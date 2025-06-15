// pages/api/favorites.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: 'Missing userId or name' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('easy_explore');

    // Check if the favorite already exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId), favorites: name });

    if (user) {
      return res.status(409).json({ message: `${name} has already been saved to your favorites.` });
    }

    // Add to favorites
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: name } }
    );

    return res.status(200).json({ message: 'Favorite saved successfully' });
  } catch (error) {
    console.error('Error saving favorite:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
