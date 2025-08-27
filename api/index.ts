import { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server';

const app = createServer();

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Remove the '/api' prefix for the express app
  req.url = req.url?.replace(/^\/api/, '') || '/';
  
  return app(req, res);
}
