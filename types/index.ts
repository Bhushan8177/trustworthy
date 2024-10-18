//types/index.ts
export interface Destination {
  id: string;
  name: string;
}

export interface Cab {
  id: string;
  name: string;
  pricePerMinute: number;
}

export interface Booking {
  id: string;
  userEmail: string;
  source: string;
  destination: string;
  cabId: string;
  startTime: Date;
  endTime: Date;
  estimatedCost: number;
}
