import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, itineraryId, attraction } = req.body;

  if (!userId || !itineraryId || !attraction) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('easy_explore');

    // Verify the user owns the itinerary
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.itineraries.some(id => id.equals(new ObjectId(itineraryId)))) {
      return res.status(403).json({ message: 'You do not own this itinerary' });
    }

    // Update the itinerary: push the new attraction if not already present
    const updateResult = await db.collection('itineraries').updateOne(
      { _id: new ObjectId(itineraryId), "attractions.id": { $ne: attraction.id } }, // only if attraction id not already in array
      { $push: { attractions: attraction } }
    );

    if (updateResult.modifiedCount === 0) {
      // Check if itinerary exists
      const itineraryExists = await db.collection('itineraries').findOne({ _id: new ObjectId(itineraryId) });
      if (!itineraryExists) {
        return res.status(404).json({ message: 'Itinerary not found' });
      } else {
        return res.status(409).json({ message: 'Attraction has already been added to your itinerary!' });
      }
    }

    return res.status(200).json({ message: 'Attraction added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
