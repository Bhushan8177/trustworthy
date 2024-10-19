import { MongoClient, Db, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!dbName) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export interface Cab {
  id: string;
  name: string;
  pricePerMinute: number;
  status: 'available' | 'unavailable';
  description: string;
}

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri as string);

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function fetchAllCabs(): Promise<Cab[]> {
  const { db } = await connectToDatabase();

  const cabs = await db
    .collection('cabs')
    .find({})
    .toArray();

  return cabs as unknown as Cab[];
}

export async function fetchAvailableCabs(): Promise<Cab[]> {
  const { db } = await connectToDatabase();

  const cabs = await db
    .collection('cabs')
    .find({ status: 'available' })
    .toArray();

  return cabs as unknown as Cab[];
}

export async function fetchCabById(id: string): Promise<Cab | null> {
  const { db } = await connectToDatabase();

  const cab = await db
    .collection('cabs')
    .findOne({ id: id });

  return cab as Cab | null;
}

export async function updateCabStatus(id: string, status: 'available' | 'unavailable'): Promise<boolean> {
  const { db } = await connectToDatabase();

  const result = await db
    .collection('cabs')
    .updateOne({ id: id }, { $set: { status: status } });

  return result.modifiedCount === 1;
}

export async function createCab(cab: Cab): Promise<string> {
  const { db } = await connectToDatabase();
  const result = await db.collection('cabs').insertOne(cab);
  return result.insertedId.toString();
}

export async function deleteCab(id: ObjectId): Promise<boolean> {
  const { db } = await connectToDatabase();
  const result = await db.collection('cabs').deleteOne({ _id: id });
  return result.deletedCount === 1;
}