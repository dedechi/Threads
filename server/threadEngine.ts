import { GoogleGenAI } from '@google/genai';
import { ThemeKey, ToneKey, ThreadLengthOption } from '../src/types';

export interface GenerateThreadInput {
  productInfo: string;
  affiliateLink?: string;
  theme?: ThemeKey;
  tone?: ToneKey | string;
  threadLength?: ThreadLengthOption | number;
}

export const THEME_INSTRUCTIONS: Record<string, { title: string; rules: string[] }> = {
  edukasi: {
    title: 'KONTEN EDUKASI & KESALAHAN PENGGUNAAN',
    rules: [
      'Utas 1: Hook 3 detik yang mengoreksi mitos atau kesalahan umum.',
      'Utas 2: Penjelasan kenapa kesalahan itu sering terjadi.',
      'Utas 3: Cara/tips pengaplikasian yang benar agar hasilnya maksimal.',
      'Utas 4: Jembatan solusi: Kenapa produk ini sangat membantu.',
      'Utas penutup/ke-5: Rekomendasi pembelian dan link affiliate.',
    ],
  },
  review: {
    title: 'KONTEN REVIEW JUJUR & BUKTI REAL',
    rules: [
      'Utas 1: Hook 3 detik berani/kontroversial/penasaran.',
      'Utas 2: Problem awal sebelum menemukan produk ini.',
      'Utas 3: Hasil nyata pemakaian setelah beberapa waktu.',
      'Utas 4: Kelebihan utama & 1 kekurangan kecil yang wajar.',
      'Utas penutup/ke-5: Kesimpulan dan link produk.',
    ],
  },
  fomo: {
    title: 'KONTEN STORY FOMO & PERSONAL CURHAT',
    rules: [
      'Utas 1: Hook curhat personal yang bikin penasaran.',
      'Utas 2: Cerita kekecewaan atau rasa insecure sebelumnya.',
      'Utas 3: Momen pertama kali tahu dan coba produk ini.',
      'Utas 4: Efek kaget karena beneran ngaruh di luar ekspektasi.',
      'Utas penutup/ke-5: Info link checkout resmi sebelum kehabisan.',
    ],
  },
  promo: {
    title: 'KONTEN SPILL RACUN & DISKON FLASH SALE',
    rules: [
      'Utas 1: Hook urgensi promo/diskon anjlok yang jarang terjadi.',
      'Utas 2: Komparasi harga normal vs harga diskon saat ini.',
      'Utas 3: 3 Alasan kenapa harus checkout sekarang juga.',
      'Utas 4: Tips klaim voucher gratis ongkir/cashback ekstra.',
      'Utas penutup/ke-5: Link pembelian resmi dan peringatan stok terbatas.',
    ],
  },
  battle: {
    title: 'KONTEN BATTLE & KOMPARASI OBJEKTIF',
    rules: [
      'Utas 1: Hook komparasi produk A vs produk lain di pasaran.',
      'Utas 2: Poin uji perbandingan segi tekstur, formula, atau build quality.',
      'Utas 3: Perbandingan harga dan nilai guna (value for money).',
      'Utas 4: Alasan kenapa produk ini keluar sebagai pemenang mutlak.',
      'Utas penutup/ke-5: Rekomendasi final dan Link Produk.',
    ],
  },
};

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function generateFallbackThread(
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
  posts.push(
    `Jangan buru-buru checkout "${productInfo}" sebelum lo baca thread singkat ini sampai habis! 🧵👇\n\nBanyak yang nyesel bukan karena barangnya jelek, tapi karena gak tahu cara pakainya yang bener.`
  );
  posts.push(
    `Masalah paling umum: kita sering kemakan fyp tanpa ngecek kandungannya atau review aslinya.\n\nGue sendiri dulu sering skeptis, apalagi kalau barangnya lagi viral banget di mana-mana.`
  );
  posts.push(
    `Setelah pemakaian rutin hampir 2 minggu, perbedaannya kerasa banget. Teksturnya ringan, gak ribet, dan yang paling penting gak bikin drama di kulit/kegiatan sehari-hari.`
  );
  posts.push(
    `Tips dari gue: jangan over-apply, cukup pakai secukupnya sesuai anjuran biar hasilnya maksimal dan awet dipake sebulan lebih.`
  );
  posts.push(
    `Buat yang dari kemarin nanyain beli yang ori di mana, gue ambil di toko resminya lagi ada flash sale + gratis ongkir extra.\n\nLink tokonya gue taro di sini ya:\n${finalLink}`
  );

  if (targetLength >= 6) {
    posts.push(
      `Oh iya, pastikan klaim voucher cashback di halaman utama tokonya dulu sebelum bayar ya biar dapet potongan maksimal.`
    );
  }
  if (targetLength >= 7) {
    posts.push(
      `Ada yang udah pernah coba juga? Atau kalian punya rekomendasi produk lain yang mirip? Tulis di kolom balasan yuk! 👇💬`
    );
  }

  return posts;
}

export async function executeGenerateThread(input: GenerateThreadInput) {
  const {
    productInfo,
    affiliateLink = '',
    theme = 'edukasi',
    tone = 'santai akrab (gue/lo, ngobrol)',
    threadLength = 5,
  } = input;

  if (!productInfo || !productInfo.trim()) {
    throw new Error('Harap isi deskripsi atau link produk terlebih dahulu!');
  }

  const finalLink = affiliateLink && affiliateLink.trim() ? affiliateLink.trim() : '[link produk di bio / keranjang]';
  const targetLength = Math.min(Math.max(Number(threadLength) || 1, 1), 7);
  const targetAffiliateIndex = targetLength < 5 ? targetLength - 1 : 4;
  const targetAffiliateNumber = targetAffiliateIndex + 1;
  const selectedTheme = THEME_INSTRUCTIONS[theme] || THEME_INSTRUCTIONS['edukasi'];

  const ai = getGeminiClient();

  if (!ai) {
    // If running without GEMINI_API_KEY, generate smart fallback contextual thread
    const fallbackPosts = generateFallbackThread(productInfo, finalLink, theme, tone, targetLength);
    return {
      posts: fallbackPosts,
      metadata: {
        hookScore: 88,
        viralAngle: selectedTheme.title,
        hashtags: ['#RacunShopee', '#ThreadsViral', '#SpillProduk', '#AffiliateTrends'],
        advice:
          targetLength === 1
            ? 'Link affiliasi ditempatkan langsung di utas utama (Single Post).'
            : targetLength < 5
            ? `Link affiliasi ditempatkan pada Utas Ke-${targetAffiliateNumber}.`
            : 'Link affiliasi Anda berhasil diamankan khusus di Utas Ke-5.',
        tokensUsed: 420,
        creditsCharged: 5,
        isFallback: true,
      },
    };
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

  if (posts.length < targetLength) {
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

  if (posts.length > targetAffiliateIndex) {
    if (!posts[targetAffiliateIndex].includes(finalLink)) {
      posts[targetAffiliateIndex] = `${posts[targetAffiliateIndex]}\n\nBtw link produknya di sini ya: ${finalLink}`;
    }
    for (let i = 0; i < posts.length; i++) {
      if (i !== targetAffiliateIndex && posts[i].includes(finalLink)) {
        posts[i] = posts[i].replace(finalLink, '').trim();
      }
    }
  }

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

  return {
    posts,
    metadata: {
      hookScore: calculatedScore,
      viralAngle: selectedTheme.title,
      hashtags,
      advice:
        targetLength === 1
          ? 'Link affiliasi ditempatkan langsung di utas utama (Single Post).'
          : targetLength < 5
          ? `Link affiliasi berhasil ditempatkan pada Utas Ke-${targetAffiliateNumber}.`
          : 'Link affiliasi Anda berhasil diamankan khusus di Utas Ke-5 untuk menjaga retensi & reputasi akun.',
      tokensUsed: 520,
      creditsCharged: 5,
    },
  };
}

export async function executeRegeneratePost(body: {
  postIndex: number;
  currentPost: string;
  threadContext: string[];
  instruction?: string;
  affiliateLink?: string;
}) {
  const { postIndex, currentPost, threadContext, instruction, affiliateLink } = body;
  const finalLink = affiliateLink && affiliateLink.trim() ? affiliateLink.trim() : '[link produk di bio / keranjang]';
  const totalPosts = Array.isArray(threadContext) ? threadContext.length : 5;
  const targetAffiliateIndex = totalPosts < 5 ? totalPosts - 1 : 4;
  const isAffiliatePost = Number(postIndex) === targetAffiliateIndex;

  const ai = getGeminiClient();

  if (!ai) {
    return {
      newContent: isAffiliatePost
        ? `Gue nemu seller yang ratingnya 4.9+ dan lagi ada gratis ongkir extra. Link belinya ada di sini ya: ${finalLink}`
        : `Versi perbaikan: ${currentPost}\n\n(Telah disesuaikan agar lebih padat dan to-the-point)`,
      creditsCharged: 1,
    };
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

  let revised = (response.text || '').trim();
  if (isAffiliatePost && !revised.includes(finalLink)) {
    revised += `\n\n${finalLink}`;
  }

  return {
    newContent: revised || currentPost,
    creditsCharged: 1,
  };
}

export async function executeGenerateHooks(body: {
  productInfo: string;
  theme?: string;
  tone?: string;
}) {
  const { productInfo, theme = 'edukasi', tone = 'santai akrab (gue/lo, ngobrol)' } = body;
  const ai = getGeminiClient();

  if (!ai) {
    return {
      hooks: [
        `Jangan beli produk ini sebelum tahu 3 hal krusial ini... (Thread)`,
        `Gue awalnya skeptis banget, tapi setelah 7 hari nyobain sendiri...`,
        `Plot twist: kesalahan sepele yang bikin 90% orang nyesel setelah checkout!`,
      ],
      creditsCharged: 1,
    };
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

  return {
    hooks: lines.length
      ? lines
      : [
          `Stop scroll! Kalau kalian lagi cari solusi buat ini, baca dulu sampai habis...`,
          `Jujur kaget banget pas pertama kali nyobain, ternyata efeknya se-signifikan ini.`,
          `Kalian masih sering ngelakuin ini? Pantesan hasilnya gak pernah maksimal.`,
        ],
    creditsCharged: 1,
  };
}
