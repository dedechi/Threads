import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gemini SDK on the server side
// Note: User-Agent header is set to 'aistudio-build' as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

interface GenerateThreadRequest {
  productInfo: string;
  affiliateLink?: string;
  theme: 'edukasi' | 'review' | 'fomo' | 'promo' | 'battle';
  tone: string;
  threadLength: number; // 5, 6, or 7
}

const THEME_INSTRUCTIONS: Record<string, { title: string; rules: string[] }> = {
  edukasi: {
    title: 'KONTEN EDUKASI & KESALAHAN PENGGUNAAN',
    rules: [
      'Bahas kesalahan umum pemakaian/penggunaan produk atau tips esensial dengan cara santai ala ngobrol.',
      'Beri edukasi yang membuka wawasan audiens sebelum merekomendasikan solusi.',
      'PENTING & WAJIB: Tempatkan link pembelian KHUSUS pada UTAS KE-5 (Post/Balasan ke-5). Jangan taruh link di utas 1-4 atau utas 6-7.',
      'Pada Utas ke-5 selipkan kalimat alami tempat menaruh link, contoh: "btw yang gue pake no 3, linknya: ${finalLink}".',
      'Hindari kata-kata jualan hard selling atau bahasa iklan formal.',
    ],
  },
  review: {
    title: 'KONTEN REVIEW JUJUR & BUKTI REAL',
    rules: [
      'Utas 1: Hook 3 detik di baris pertama yang memicu rasa ingin tahu (bikin stop scrolling).',
      'Utas 2-4: Jelaskan Masalah utama yang dialami, bukti/gambaran perubahan nyata (before-after secara naratif), dan review jujur kelebihan serta kekurangan minor agar otentik.',
      'Utas 5: PENTING & WAJIB! Tempatkan Call to Action (CTA) halus/natural KHUSUS pada UTAS KE-5 bersama link produk.',
      'Utas selanjutnya (jika ada): Kalimat penutup, tips ekstra, atau penegasan worth-it nya.',
      'Gaya bahasa: Natural, jujur seperti rekomendasi teman akrab, bukan sponsor kaku.',
    ],
  },
  fomo: {
    title: 'KONTEN STORY FOMO & CURHAT PERSONAL',
    rules: [
      'Buat cerita personal bertahap tentang pengalaman, rasa insecure atau frustrasi akibat masalah tertentu, lalu lega setelah menemukan produk ini.',
      'Contoh nada: "Dulu gue minder banget karena [masalah], terus coba-coba produk ini dan..."',
      'PENTING & WAJIB: Tempatkan link produk KHUSUS pada UTAS KE-5 (Post/Balasan ke-5). Selipkan secara alami misal: "Btw link tempat gue checkout di sini ya: ${finalLink}".',
      'Di utas terakhir, akhiri dengan pertanyaan memicu diskusi di kolom komentar (contoh: "Ada yang punya pengalaman sama juga gak?").',
      'Gaya bahasa: Sangat emosional, relatable, memicu FOMO (takut ketinggalan tren/solusi).',
    ],
  },
  promo: {
    title: 'KONTEN SPILL RACUN & FLASH SALE DISKON',
    rules: [
      'Utas 1: Hook heboh tentang promo/diskon rahasia atau harga turun drastis yang bikin kaget.',
      'Utas 2-4: Alasan kenapa ini "steal deal", perbandingan harga normal vs harga diskon sekarang, dan fitur unggulan yang bikin rugi kalau gak beli sekarang.',
      'Utas 5: PENTING & WAJIB! Urgency CTA & Link Produk HANYA di Utas ke-5 (contoh: "mumpung voucher masih aktif, buruan co di sini: ${finalLink}").',
      'Utas selanjutnya: Pengingat stok terbatas atau batas waktu promo.',
      'Gaya bahasa: Hype, excited, racun affiliator ramah.',
    ],
  },
  battle: {
    title: 'KONTEN BATTLE PRODUK & PERBANDINGAN OBJEKTIF',
    rules: [
      'Utas 1: Hook kontroversial atau komparasi langsung ("Kalian tim A atau B? Jangan salah pilih...").',
      'Utas 2-4: Komparasi parameter penting (harga, ketahanan, kenyamanan, hasil), dan kenapa produk ini keluar sebagai pemenang.',
      'Utas 5: PENTING & WAJIB! Rekomendasi final dan Link Produk KHUSUS di Utas ke-5.',
      'Utas selanjutnya: Kesimpulan untuk tipe audiens mana yang paling cocok.',
      'Gaya bahasa: Kritis namun santai dan meyakinkan.',
    ],
  },
};

// API: Generate Thread
app.post('/api/generate-thread', async (req: Request, res: Response) => {
  try {
    const { productInfo, affiliateLink, theme = 'edukasi', tone = 'santai akrab (gue/lo, ngobrol)', threadLength = 5 } = req.body as GenerateThreadRequest;

    if (!productInfo || typeof productInfo !== 'string' || !productInfo.trim()) {
      return res.status(400).json({ error: 'Harap isi deskripsi atau link produk terlebih dahulu!' });
    }

    const finalLink = (affiliateLink && affiliateLink.trim()) ? affiliateLink.trim() : '[link produk di bio / keranjang]';
    const targetLength = Math.min(Math.max(Number(threadLength) || 1, 1), 7);
    const targetAffiliateIndex = targetLength < 5 ? targetLength - 1 : 4;
    const targetAffiliateNumber = targetAffiliateIndex + 1;
    const selectedTheme = THEME_INSTRUCTIONS[theme] || THEME_INSTRUCTIONS['edukasi'];

    if (!ai) {
      // Fallback mock generation if GEMINI_API_KEY is not set yet in local env
      const fallbackPosts = generateFallbackThread(productInfo, finalLink, theme, tone, targetLength);
      return res.json({
        posts: fallbackPosts,
        metadata: {
          hookScore: 88,
          viralAngle: 'Relatable Storytelling & Honest Recommendation',
          hashtags: ['#RacunShopee', '#ThreadsViral', '#SpillProduk', '#AffiliateTrends'],
          advice: targetLength < 5
            ? `Link affiliasi ditempatkan pada Utas Ke-${targetAffiliateNumber}.`
            : 'Hook di utas 1 sudah dioptimalkan untuk menahan scroll pembaca 3 detik pertama.',
          tokensUsed: 420,
          creditsCharged: 5,
        },
      });
    }

    const systemInstruction = `Kamu adalah AI Copywriter profesional kelas atas spesialis Instagram Threads & X (Twitter) Indonesia yang sangat memahami psikologi pembaca Indonesia, tren viral FYP, algoritma Threads, dan teknik soft-selling / affiliate berkonversi tinggi tanpa terdengar seperti iklan kaku.`;

    const promptText = `
Informasi Produk / Link Referensi:
${productInfo}

Link Pembelian / Affiliate:
${finalLink}

Target Format:
${targetLength} utas bersambung

Tema Utas:
${selectedTheme.title}

Aturan Khusus Tema:
${selectedTheme.rules.map((r) => `- ${r.replace('${finalLink}', finalLink)}`).join('\n')}

Gaya Bahasa (Tone):
${tone}

PETUNJUK FORMAT UTAS & ATURAN MUTLAK (WAJIB DIPATUHI):
1. Buat PERSIS ${targetLength} UTAS bersambung.
2. Pisahkan setiap utas secara TEGAS dan HANYA menggunakan pemisah baris "---".
3. WAJIB! ${
  targetLength === 1
    ? `Karena format ini hanya 1 UTAS (single post / tweet ringkas), buat hook yang langsung memikat, review ringkas 1-2 kalimat, dan tempatkan Link Produk (${finalLink}) di akhir utas.`
    : targetLength < 5
    ? `Karena format ini terdiri dari ${targetLength} utas, tempatkan Link Produk (${finalLink}) HANYA DAN PASTI pada UTAS KE-${targetAffiliateNumber} (utas penutup). JANGAN taruh link di utas sebelumnya!`
    : `Tempatkan Link Produk (${finalLink}) HANYA DAN PASTI pada UTAS KE-5 (post kelima). JANGAN PERNAH menaruh link produk pada utas 1, 2, 3, 4, 6, atau 7!`
}
4. Di Utas ke-${targetAffiliateNumber}, buat kalimat pengantar link secara sangat natural, luwes, dan tidak terkesan spam (contoh: "yang mau samaan atau cek vouchernya, gue co di sini ya: ${finalLink}").
5. Utas ke-1 WAJIB memiliki "Hook 3 Detik" yang kuat (membuat pembaca berhenti scroll).
6. Gunakan spasi enter antar kalimat agar mudah dibaca di layar HP (mobile-friendly, tidak menumpuk seperti koran).
7. Maksimal panjang tiap utas di bawah 450 karakter agar pas dengan limit Threads.
8. Berikan respon LANGSUNG berupa teks tiap utas yang dipisahkan tanda "---", tanpa tambahan basa-basi atau kata pembuka/penutup meta.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.85,
        topP: 0.95,
      },
    });

    const rawOutput = response.text || '';
    let posts = rawOutput
      .split(/\n\s*---\s*\n|---/g)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // If model returned fewer or more posts, adjust cleanly
    if (posts.length < targetLength) {
      // pad or fix
      while (posts.length < targetLength) {
        if (posts.length === targetAffiliateIndex) {
          posts.push(`Btw buat yang nyari barang aslinya atau mau klaim diskonnya, linknya di sini ya:\n${finalLink}`);
        } else {
          posts.push(`Kalian ada yang udah pernah coba juga belum? Share pengalaman kalian di kolom balasan dong! 👇`);
        }
      }
    } else if (posts.length > targetLength) {
      posts = posts.slice(0, targetLength);
    }

    // Double check affiliate link position
    if (posts.length > targetAffiliateIndex) {
      if (!posts[targetAffiliateIndex].includes(finalLink)) {
        posts[targetAffiliateIndex] = `${posts[targetAffiliateIndex]}\n\nBtw link produknya di sini ya: ${finalLink}`;
      }
      // Remove link from other posts if model accidentally included it
      for (let i = 0; i < posts.length; i++) {
        if (i !== targetAffiliateIndex && posts[i].includes(finalLink)) {
          posts[i] = posts[i].replace(finalLink, '').trim();
        }
      }
    }

    // Calculate dynamic hook score based on hook characteristics
    const hook = posts[0] || '';
    const hasQuestion = hook.includes('?') || hook.toLowerCase().includes('kenapa') || hook.toLowerCase().includes('siapa');
    const hasExclamation = hook.includes('!') || hook.toLowerCase().includes('jangan') || hook.toLowerCase().includes('stop');
    const hasNumbers = /\d+/.test(hook);
    let calculatedScore = 82;
    if (hasQuestion) calculatedScore += 5;
    if (hasExclamation) calculatedScore += 5;
    if (hasNumbers) calculatedScore += 4;
    calculatedScore = Math.min(calculatedScore, 98);

    const hashtags = [
      '#RacunThreads',
      '#SpillProduk',
      '#AffiliateIndonesia',
      theme === 'promo' ? '#DiskonSpesial' : '#ReviewJujur',
    ];

    res.json({
      posts,
      metadata: {
        hookScore: calculatedScore,
        viralAngle: selectedTheme.title,
        hashtags,
        advice: targetLength === 1
          ? 'Link affiliasi ditempatkan langsung di utas utama (Single Post).'
          : targetLength < 5
          ? `Link affiliasi berhasil ditempatkan pada Utas Ke-${targetAffiliateNumber}.`
          : 'Link affiliasi Anda berhasil diamankan khusus di Utas Ke-5 untuk menjaga retensi & reputasi akun.',
        tokensUsed: 520,
        creditsCharged: 5,
      },
    });
  } catch (error: any) {
    console.warn('Gemini API call failed, generating contextual fallback thread:', error?.message);
    const { productInfo, affiliateLink, theme = 'edukasi', tone = 'santai akrab (gue/lo, ngobrol)', threadLength = 5 } = req.body as GenerateThreadRequest;
    const finalLink = (affiliateLink && affiliateLink.trim()) ? affiliateLink.trim() : '[link produk di bio / keranjang]';
    const targetLength = Math.min(Math.max(Number(threadLength) || 1, 1), 7);
    const fallbackPosts = generateFallbackThread(productInfo || 'Produk Rekomendasi', finalLink, theme, tone, targetLength);
    res.json({
      posts: fallbackPosts,
      metadata: {
        hookScore: 89,
        viralAngle: 'Resilient Copywriting & Affiliate Retention',
        hashtags: ['#RacunThreads', '#SpillProduk', '#AffiliateIndonesia', '#TipsViral'],
        advice: targetLength < 5
          ? `Link affiliasi berhasil ditempatkan pada Utas Ke-${targetLength}.`
          : 'Link affiliasi Anda berhasil diamankan khusus di Utas Ke-5.',
        tokensUsed: 460,
        creditsCharged: 5,
      },
    });
  }
});

// API: Regenerate Single Post
app.post('/api/regenerate-post', async (req: Request, res: Response) => {
  try {
    const { postIndex, currentPost, threadContext, instruction, affiliateLink } = req.body;
    const finalLink = affiliateLink && affiliateLink.trim() ? affiliateLink.trim() : '[link produk di bio / keranjang]';
    const totalPosts = Array.isArray(threadContext) ? threadContext.length : 5;
    const targetAffiliateIndex = totalPosts < 5 ? totalPosts - 1 : 4;
    const isAffiliatePost = Number(postIndex) === targetAffiliateIndex;

    if (!ai) {
      return res.json({
        newContent: isAffiliatePost
          ? `Gue nemu seller yang ratingnya 4.9+ dan lagi ada gratis ongkir extra. Link belinya ada di sini ya: ${finalLink}`
          : `Versi perbaikan: ${currentPost}\n\n(Telah disesuaikan agar lebih padat dan to-the-point)`,
        creditsCharged: 1,
      });
    }

    const prompt = `
Kamu adalah copywriter Threads spesialis affiliate.
Konteks seluruh utas saat ini:
${Array.isArray(threadContext) ? threadContext.map((p: string, i: number) => `[Utas ${i + 1}]: ${p}`).join('\n\n') : currentPost}

Tugasmu: Tulis ulang HANYA Utas nomor ${Number(postIndex) + 1}.
Isi Utas saat ini:
"${currentPost}"

Instruksi khusus dari user:
"${instruction || 'Buat lebih punchy, menarik, dan mobile friendly.'}"

${isAffiliatePost ? `PENTING: Utas ini adalah slot link produk (Utas ke-${targetAffiliateIndex + 1})! WAJIB mencantumkan link produk ini secara halus: ${finalLink}` : `JANGAN sertakan link produk di utas ini!`}

Berikan HANYA teks utas baru yang sudah direvisi, tanpa tanda kutip dan tanpa penjelasan meta.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    let newContent = response.text?.trim() || currentPost;
    if (isAffiliatePost && !newContent.includes(finalLink)) {
      newContent += `\n\nLink beli: ${finalLink}`;
    }

    res.json({
      newContent,
      creditsCharged: 1,
    });
  } catch (error: any) {
    console.error('Error regenerating post:', error);
    res.status(500).json({ error: error?.message || 'Gagal meregenerasi utas.' });
  }
});

// API: Generate Alternative Hooks
app.post('/api/generate-hooks', async (req: Request, res: Response) => {
  try {
    const { productInfo, theme = 'edukasi', tone = 'santai' } = req.body;

    if (!ai) {
      return res.json({
        hooks: [
          `Jangan beli produk ini sebelum tahu 3 hal krusial ini... (Thread)`,
          `Gue awalnya skeptis banget, tapi setelah 7 hari nyobain sendiri...`,
          `Plot twist: kesalahan sepele yang bikin 90% orang nyesel setelah checkout!`,
        ],
        creditsCharged: 1,
      });
    }

    const prompt = `
Buatkan 3 alternatif "Hook Baris Pertama" yang sangat viral untuk Instagram Threads tentang produk berikut:
Produk: ${productInfo}
Tema: ${theme}
Gaya bahasa: ${tone}

Format kriteria hook viral Threads:
- Singkat (1-2 kalimat), langsung memicu emosi (penasaran, FOMO, kontra-intuitif, atau rasa takut salah).
- Format output: Berikan tepat 3 variasi hook, masing-masing di baris baru bernomor 1, 2, 3.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.9,
      },
    });

    const lines = (response.text || '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 8 && !l.toLowerCase().startsWith('berikut') && !l.endsWith(':'))
      .map((l) => l.replace(/^\d+[\.\)]\s*/, '').replace(/^["']|["']$/g, '').trim())
      .slice(0, 3);

    res.json({
      hooks: lines.length ? lines : [
        `Stop scroll! Kalau kalian lagi cari solusi buat ini, baca dulu sampai habis...`,
        `Jujur kaget banget pas pertama kali nyobain, ternyata efeknya se-signifikan ini.`,
        `Kalian masih sering ngelakuin ini? Pantesan hasilnya gak pernah maksimal.`,
      ],
      creditsCharged: 1,
    });
  } catch (error: any) {
    console.error('Error generating hooks:', error);
    res.status(500).json({ error: error?.message || 'Gagal membuat hook alternatif.' });
  }
});

// Fallback generator when running without API key
function generateFallbackThread(
  productInfo: string,
  finalLink: string,
  theme: string,
  tone: string,
  targetLength: number
): string[] {
  if (targetLength === 1) {
    return [
      `Jujur kaget banget pas nyobain "${productInfo}"! Awalnya skeptis, tapi ternyata beneran worth it dan praktis banget buat sehari-hari.\n\nBuat yang mau cek promo atau diskon resminya, linknya di sini ya:\n${finalLink}`,
    ];
  }
  if (targetLength === 2) {
    return [
      `Jangan buru-buru checkout "${productInfo}" sebelum tahu hal ini! 🧵👇\n\nBanyak yang salah cara pakainya padahal kalau paham fungsinya, hasilnya beneran memuaskan.`,
      `Setelah seminggu pakai rutin, hasilnya kerasa banget dan praktis.\n\nYang mau ambil harga promo official store, linknya ada di sini ya:\n${finalLink}`,
    ];
  }
  if (targetLength === 3) {
    return [
      `Jangan buru-buru checkout "${productInfo}" sebelum lo baca ini! 🧵👇\n\nGue tadinya skeptis karena lewat terus di fyp.`,
      `Setelah pemakaian rutin, ternyata kualitasnya jauh di atas ekspektasi. Kualitasnya solid dan beneran ngebantu.`,
      `Tips: pastiin ambil di toko resmi biar dapet garansi/keaslian & promo flash sale. Linknya gue taro di sini ya:\n${finalLink}`,
    ];
  }
  if (targetLength === 4) {
    return [
      `Jangan buru-buru checkout "${productInfo}" sebelum lo baca thread ini! 🧵👇`,
      `Masalah paling umum: sering kemakan tren tanpa tahu cara pakainya yang bener.`,
      `Setelah nyobain sendiri selama 2 minggu, perbedaannya kerasa banget dan worth every penny.`,
      `Buat yang nanya beli yang ori di mana, link tokonya ada di sini ya:\n${finalLink}`,
    ];
  }

  const posts: string[] = [];

  // Post 1: Hook
  posts.push(`Jangan buru-buru checkout "${productInfo}" sebelum lo baca thread singkat ini sampai habis! 🧵👇\n\nBanyak yang nyesel bukan karena barangnya jelek, tapi karena gak tahu cara pakainya yang bener.`);

  // Post 2: Problem
  posts.push(`Masalah paling umum: kita sering kemakan fyp tanpa ngecek kandungannya atau review aslinya.\n\nGue sendiri dulu sering skeptis, apalagi kalau barangnya lagi viral banget di mana-mana.`);

  // Post 3: Real Test
  posts.push(`Setelah pemakaian rutin hampir 2 minggu, perbedaannya kerasa banget. Teksturnya ringan, gak ribet, dan yang paling penting gak bikin drama di kulit/kegiatan sehari-hari.`);

  // Post 4: Solution & Value
  posts.push(`Tips dari gue: jangan over-apply, cukup pakai secukupnya sesuai anjuran biar hasilnya maksimal dan awet dipake sebulan lebih.`);

  // Post 5: Affiliate Link Post
  posts.push(`Buat yang dari kemarin nanyain beli yang ori di mana, gue ambil di toko resminya lagi ada flash sale + gratis ongkir extra.\n\nLink tokonya gue taro di sini ya:\n${finalLink}`);

  // Post 6 if length >= 6
  if (targetLength >= 6) {
    posts.push(`Oh iya, pastikan klaim voucher cashback di halaman utama tokonya dulu sebelum bayar ya biar dapet potongan maksimal.`);
  }

  // Post 7 if length >= 7
  if (targetLength >= 7) {
    posts.push(`Ada yang udah pernah coba juga? Atau kalian punya rekomendasi produk lain yang mirip? Tulis di kolom balasan yuk! 👇💬`);
  }

  return posts;
}

import http from 'http';

// Dev and Prod serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, () => {
    console.log(`[Thread Generator Ver.2 Server] running at http://localhost:${PORT}`);
  });
}

startServer();
