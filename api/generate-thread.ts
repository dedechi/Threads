import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeGenerateThread } from '../server/threadEngine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Metode HTTP tidak diizinkan. Gunakan POST.',
      code: 'METHOD_NOT_ALLOWED',
      detail: `Menerima request dengan metode ${req.method}`,
    });
  }

  try {
    const { productInfo, affiliateLink, theme, tone, threadLength } = req.body || {};

    if (!productInfo || typeof productInfo !== 'string' || !productInfo.trim()) {
      return res.status(400).json({
        error: 'Harap isi deskripsi atau link produk terlebih dahulu!',
        code: 'VALIDATION_ERROR',
        detail: 'Parameter `productInfo` kosong atau tidak valid.',
        suggestion: 'Isi textarea produk dengan nama produk, keunggulan, atau link shopee/tokopedia.',
      });
    }

    const result = await executeGenerateThread({
      productInfo,
      affiliateLink,
      theme,
      tone,
      threadLength,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Vercel API generate-thread error:', err);

    const errorMessage = err?.message || 'Terjadi kesalahan saat memproses utas.';
    const isApiKeyError = errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('apikey');

    return res.status(500).json({
      error: isApiKeyError
        ? 'Kunci API Gemini tidak valid atau belum disetel di Vercel.'
        : `Kesalahan saat membuat Utas: ${errorMessage}`,
      code: isApiKeyError ? 'GEMINI_API_KEY_ERROR' : 'INTERNAL_SERVER_ERROR',
      detail: err?.stack || errorMessage,
      suggestion: isApiKeyError
        ? 'Buka dashboard Vercel > Proyek Anda > Settings > Environment Variables > Tambahkan GEMINI_API_KEY.'
        : 'Coba beberapa saat lagi atau periksa koneksi internet Anda.',
    });
  }
}
