import { NextApiRequest, NextApiResponse } from 'next';
import { createCab, deleteCab, fetchAllCabs, fetchAvailableCabs, fetchCabById, updateCabStatus } from '@/libs/cabs';

/**
 * Handles GET and PUT API requests to fetch or update cab data.
 * @example
 * handler(req, res)
 * // For example, on a GET request with query { id: "123" }, it might return cab data for that ID.
 * @param {NextApiRequest} req - The request object containing method, query, and body.
 * @param {NextApiResponse} res - The response object used to send back the desired HTTP response.
 * @returns {void} Sends HTTP response with JSON data or error message.
 * @description
 *   - Supports only GET and PUT methods.
 *   - Handles errors and returns appropriate HTTP status codes.
 *   - Responds with allowed methods on invalid request methods.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id, available } = req.query;

      if (id) {
        const cab = await fetchCabById(id as string);
        if (cab) {
          res.status(200).json(cab);
        } else {
          res.status(404).json({ message: 'Cab not found' });
        }
      } else if (available === 'true') {
        const cabs = await fetchAvailableCabs();
        res.status(200).json(cabs);
      } else {
        const cabs = await fetchAllCabs();
        res.status(200).json(cabs);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cabs' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, status } = req.body;
      if (!id || !status) {
        res.status(400).json({ message: 'Missing id or status' });
        return;
      }
      const success = await updateCabStatus(id, status);
      if (success) {
        res.status(200).json({ message: 'Cab status updated successfully' });
      } else {
        res.status(404).json({ message: 'Cab not found or status not updated' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating cab status' });
    }
  } else if(req.method === 'POST') {

    //create a new cab
    const cab = req.body;
    const success = await createCab(cab);
    if (success) {
      res.status(201).json({ message: 'Cab created successfully' });
    } else {
      res.status(500).json({ message: 'Error creating cab' });
    }
  } else if (req.method === 'DELETE') {
    //delete a cab
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ message: 'Missing id' });
      return;
    }
    const success = await deleteCab(id as string);
    if (success) {
      res.status(200).json({ message: 'Cab deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cab not found or not deleted' });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}