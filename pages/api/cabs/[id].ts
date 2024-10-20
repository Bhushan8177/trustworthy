import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/libs/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid cab ID' });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid cab ID format' });
      }

      const cabId = new ObjectId(id);

      const { db } = await connectToDatabase();
      const result = await db.collection('cabs').deleteOne({ _id: cabId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Cab not found' });
      }

      res.status(200).json({ message: 'Cab deleted successfully' });
    } catch (error) {
      console.error('Error deleting cab:', error);
      res.status(500).json({ message: 'Error deleting cab', error: (error as Error).message });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const updates = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid cab ID' });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    try {
      const { db } = await connectToDatabase();
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid cab ID format' });
      }

      const cabId = new ObjectId(id);

      // Validate pricePerMinute if it's provided
      if (updates.pricePerMinute !== undefined && typeof updates.pricePerMinute !== 'number') {
        return res.status(400).json({ message: 'Invalid pricePerMinute. It must be a number.' });
      }

      const result = await db.collection('cabs').updateOne(
        { _id: cabId },
        { $set: updates }
      );

      console.log('Update result:', result); // For debugging

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Cab not found' });
      }

      if (result.modifiedCount === 0) {
        return res.status(200).json({ message: 'No changes were made to the cab' });
      }

      res.status(200).json({ message: 'Cab updated successfully' });
    } catch (error) {
      console.error('Error updating cab:', error);
      res.status(500).json({ message: 'Error updating cab', error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}