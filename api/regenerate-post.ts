import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeRegeneratePost } from '../server/threadEngine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode HTTP tidak diizinkan.' });
  }

  try {
    const result = await executeRegeneratePost(req.body || {});
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Vercel API regenerate-post error:', err);
    return res.status(500).json({
      error: `Gagal meregenerasi utas: ${err?.message || 'Unknown error'}`,
      code: 'REGENERATE_ERROR',
      detail: err?.stack || err?.message,
    });
  }
}
