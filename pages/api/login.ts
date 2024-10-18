import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../libs/mongodb';
import { findUserByEmail, verifyPassword } from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const { db } = await connectToDatabase();
      
      const user = await findUserByEmail(db, email);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await verifyPassword(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn: '1h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ token, user: userWithoutPassword });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error during login', error: (error as any).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}