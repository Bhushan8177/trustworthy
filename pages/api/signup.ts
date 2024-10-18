import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../libs/mongodb';
import { createUser, findUserByEmail, User } from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password, role } = req.body;

    try {
      const { db } = await connectToDatabase();

      const existingUser = await findUserByEmail(db, email);

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      const newUser: Omit<User, '_id' | 'createdAt' | 'updatedAt'> = {
        name,
        email,
        password,
        role: role as 'user' | 'driver' | 'admin',
      };

      const createdUser = await createUser(db, newUser);

      res.status(201).json({ message: 'User created successfully', userId: createdUser._id });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}