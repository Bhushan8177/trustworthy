import { ObjectId } from "mongodb";

//types/index.ts
export interface Destination {
  id: string;
  name: string;
}

export interface Cab {
  id: ObjectId;
  name: string;
  pricePerMinute: number;
  description: string;
  status: 'available' | 'in-progress' | 'unavailable';
}

export interface Booking {
  id: ObjectId;
  userEmail: string;
  source: string;
  destination: string;
  cabId: string;
  startTime: Date;
  endTime: Date;
  estimatedCost: number;
}

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
}