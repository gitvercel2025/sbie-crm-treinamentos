import { VercelRequest, VercelResponse } from '@vercel/node';
import { handleDemo } from '../server/routes/demo';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return handleDemo(req as any, res as any);
}
