import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/libs/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received request to update cab status:', { method: req.method, id: req.query.id, body: req.body });

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid cab ID' });
  }

  if (!status || (status !== 'available' && status !== 'unavailable')) {
    return res.status(400).json({ message: 'Invalid status. Must be "available" or "unavailable".' });
  }

  try {
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid cab ID format' });
    }

    const cabId = new ObjectId(id);
    
    console.log('Attempting to update cab status:', { cabId, status });

    const result = await db.collection('cabs').updateOne(
      { _id: cabId },
      { $set: { status } }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Cab not found' });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'Cab status was already up to date' });
    }

    res.status(200).json({ message: 'Cab status updated successfully' });
  } catch (error) {
    console.error('Error updating cab status:', error);
    res.status(500).json({ message: 'Error updating cab status', error: (error as Error).message });
  }
}