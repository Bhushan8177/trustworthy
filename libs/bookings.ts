import axios from 'axios';

export const confirmBooking = async (bookingDetails: any) => {
  try {
    const response = await axios.post('/api/bookings', bookingDetails);
    return response.data;
  } catch (error) {
    console.error('Error confirming booking:', error);
    throw error;
  }
};