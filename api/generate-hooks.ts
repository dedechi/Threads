import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeGenerateHooks } from '../server/threadEngine';

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
    const result = await executeGenerateHooks(req.body || {});
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Vercel API generate-hooks error:', err);
    return res.status(500).json({
      error: `Gagal membuat variasi hook: ${err?.message || 'Unknown error'}`,
      code: 'HOOKS_ERROR',
      detail: err?.stack || err?.message,
    });
  }
}
