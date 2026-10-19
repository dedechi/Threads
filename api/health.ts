import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  return res.status(200).json({
    status: 'ok',
    app: 'Thread Generator Ver.2',
    timestamp: Date.now(),
    environment: {
      hasGeminiKey,
      isVercel: Boolean(process.env.VERCEL),
      nodeVersion: process.version,
    },
    message: hasGeminiKey
      ? 'Backend API aktif dan siap dengan GEMINI_API_KEY.'
      : 'PERINGATAN: GEMINI_API_KEY belum terdeteksi di Environment Variables Vercel.',
  });
}
