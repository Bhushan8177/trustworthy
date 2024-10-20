import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/libs/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userEmail } = req.query;

    if (!userEmail || typeof userEmail !== 'string') {
      return res.status(400).json({ message: 'Valid user email is required' });
    }

    console.log('Fetching bookings for user:', userEmail);

    try {
      const { db } = await connectToDatabase();
      const bookings = await db
        .collection('bookings')
        .find({ userEmail: userEmail })
        .sort({ createdAt: -1 })
        .toArray();

      res.status(200).json(bookings || []);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      res.status(500).json({ message: 'Error fetching booking history' });
    }
  } else if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const booking = req.body;
      booking.createdAt = new Date();

      const result = await db.collection('bookings').insertOne(booking);

      console.log('Booking created:', result.insertedId);

      res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertedId });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Error creating booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}