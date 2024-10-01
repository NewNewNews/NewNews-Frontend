import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post('http://localhost:8080/api/register', req.body);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to register user' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
