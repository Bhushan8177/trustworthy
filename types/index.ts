import { ObjectId, OrderedBulkOperation } from "mongodb";

//types/index.ts
export interface Destination {
  id: string;
  name: string;
}

export interface Cab {
  _id: ObjectId;
  name: string;
  pricePerMinute: number;
  status: 'available' | 'unavailable';
  description: string;
  startTime?: Date;
  endTime?: Date;
}

export interface Booking {
  _id: ObjectId;
  userEmail : string;
  source: string;
  destination: string;
  estimatedTime: number;
  estimatedPrice: number;
  cabName: string;
  arrivalTime: string;
}

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
}