import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { User } from '@/types';

export async function createUser(db: any, userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const now = new Date();
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser: User = {
    ...userData,
    _id: new ObjectId(),
    password: hashedPassword,
  };

  const result = await db.collection('users').insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}

export async function findUserByEmail(db: any, email: string): Promise<User | null> {
  return db.collection('users').findOne({ email });
}

//fine user by id
export async function findUserById(db: any, userId: ObjectId): Promise<User | null> {
  return db.collection('users').findOne({ _id: userId });
}

export async function updateUser(db: any, userId: ObjectId, updates: Partial<Omit<User, 'password'>>): Promise<User | null> {
  const result = await db.collection('users').findOneAndUpdate(
    { _id: userId },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result.value;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}