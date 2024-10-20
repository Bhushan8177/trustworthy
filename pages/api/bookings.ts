import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/libs/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const booking = req.body;
      booking.createdAt = new Date();

      const result = await db.collection('bookings').insertOne(booking);

      res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertedId });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Error creating booking' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}