import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB = process.env.MONGODB_DB as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
}

let cached: CachedConnection = { client: null, db: null };

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);

    cached = { client, db };
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (cached.client) {
    await cached.client.close();
    cached = { client: null, db: null };
  }
}