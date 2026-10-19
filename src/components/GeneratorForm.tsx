import React from 'react';
import {
  Sparkles,
  Link2,
  FileText,
  Layers,
  Smile,
  Zap,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { ThemeKey, ToneKey, ThreadLengthOption, ThemeOption, ToneOption } from '../types';
import { PRODUCT_PRESETS } from '../data/presets';

interface GeneratorFormProps {
  productInfo: string;
  setProductInfo: (val: string) => void;
  affiliateLink: string;
  setAffiliateLink: (val: string) => void;
  theme: ThemeKey;
  setTheme: (val: ThemeKey) => void;
  tone: ToneKey;
  setTone: (val: ToneKey) => void;
  threadLength: ThreadLengthOption;
  setThreadLength: (val: ThreadLengthOption) => void;
  isLoading: boolean;
  onGenerate: () => void;
  userCredits: number;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'edukasi',
    label: '1. Konten Edukasi',
    badge: 'Tips / Edukatif',
    description: 'Membahas kesalahan umum & tips penggunaan produk dengan santai ala ngobrol.',
    iconName: 'Book',
  },
  {
    value: 'review',
    label: '2. Review Jujur',
    badge: 'Hook → Solusi',
    description: 'Struktur: Hook 3 detik - Masalah - Bukti/Hasil - Solusi - CTA Halus.',
    iconName: 'Check',
  },
  {
    value: 'fomo',
    label: '3. Story FOMO & Curhat',
    badge: 'Personal Story',
    description: 'Cerita personal singkat tentang insecure/masalah lalu ketolong oleh produk.',
    iconName: 'Flame',
  },
  {
    value: 'promo',
    label: '4. Spill Racun & Diskon',
    badge: 'Flash Sale Hype',
    description: 'Spill voucher rahasia, diskon anjlok, dan urgensi checkout sebelum kehabisan.',
    iconName: 'Tag',
  },
  {
    value: 'battle',
    label: '5. Battle & Komparasi',
    badge: 'A vs B Objektif',
    description: 'Komparasi objektif lawan brand lain, kenapa produk ini jadi pemenang mutlak.',
    iconName: 'Swords',
  },
];

const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'santai akrab (gue/lo, ngobrol)',
    label: 'Santai & Akrab (Gue/Lo)',
    description: 'Gaya nongkrong santai, akrab, cocok buat audiens muda/lifestyle.',
  },
  {
    value: 'kasual sopan (aku/kamu)',
    label: 'Kasual & Ramah (Aku/Kamu)',
    description: 'Sopan, hangat, dan ramah seperti saran teman baik.',
  },
  {
    value: 'dramatis storytelling',
    label: 'Slightly Dramatis / Storyteller',
    description: 'Emosional, beralur cerita, bikin penasaran baris demi baris.',
  },
  {
    value: 'singkat to-the-point',
    label: 'Singkat & To-the-point',
    description: 'Langsung pada inti manfaat tanpa banyak basa-basi.',
  },
  {
    value: 'genz viral (racun/spill)',
    label: 'Gen-Z Hype (Racun / Spill)',
    description: 'Bahasa slang kekinian: racun, no debat, nangis bgt, worth it parah.',
  },
];

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  productInfo,
  setProductInfo,
  affiliateLink,
  setAffiliateLink,
  theme,
  setTheme,
  tone,
  setTone,
  threadLength,
  setThreadLength,
  isLoading,
  onGenerate,
  userCredits,
}) => {
  const isAffiliateLinkFilled = affiliateLink.trim().length > 0;
  const isInsufficientCredit = userCredits < 5;

  const handleApplyPreset = (preset: (typeof PRODUCT_PRESETS)[0]) => {
    setProductInfo(preset.productInfo);
    setAffiliateLink(preset.affiliateLink);
    setTheme(preset.recommendedTheme);
    setTone(preset.recommendedTone);
  };

  const handleResetForm = () => {
    setProductInfo('');
    setAffiliateLink('');
    setTheme('edukasi');
    setTone('santai akrab (gue/lo, ngobrol)');
    setThreadLength(5);
  };

  return (
    <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-5 lg:p-6 shadow-xl backdrop-blur-sm space-y-6">
      {/* Form Top Title & Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-sm lg:text-base font-bold text-white tracking-tight">
              Konfigurasi Utas Threads
            </h2>
          </div>
          <button
            onClick={handleResetForm}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            title="Bersihkan Formulir"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Quick Presets for Affiliators */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Coba Contoh Cepat:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRODUCT_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-white transition-all active:scale-95 text-left"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input 1: Product Info */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
            <span>Link Produk / Nama & Deskripsi Ringkas</span>
            <span className="text-rose-400">*</span>
          </label>
          <span className="text-[10px] text-zinc-500">
            {productInfo.length} karakter
          </span>
        </div>
        <textarea
          rows={3}
          value={productInfo}
          onChange={(e) => setProductInfo(e.target.value)}
          placeholder="Contoh: Sunscreen Brightening Spray Skintific (atau tempelkan link shopee/tokopedia/tiktok beserta poin keunggulan)..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all resize-y leading-relaxed"
        />
        <p className="text-[11px] text-zinc-400">
          💡 Semakin spesifik manfaat atau masalah yang diselesaikan, semakin tajam hook utas yang dihasilkan.
        </p>
      </div>

      {/* Input 2: Affiliate Link */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Link Affiliate / Pembelian</span>
            <span className="text-[10px] text-zinc-400 font-normal">(Opsional)</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Ditaruh di Utas #5
          </span>
        </div>
        <input
          type="text"
          value={affiliateLink}
          onChange={(e) => setAffiliateLink(e.target.value)}
          placeholder="https://shope.ee/xxxxx atau link toko kamu..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all font-mono"
        />
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90">
          <CheckCircle className="w-3 h-3 shrink-0" />
          <span>
            {isAffiliateLinkFilled
              ? 'Link affiliasi aktif akan disisipkan secara halus di post ke-5.'
              : 'Jika dikosongkan, AI akan otomatis menggunakan default: "[link produk di bio / keranjang]".'}
          </span>
        </div>
      </div>

      {/* Input 3: Theme Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-200 block">
          Pilih Tema Utas <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2">
          {THEME_OPTIONS.map((item) => {
            const isSelected = theme === item.value;
            return (
              <div
                key={item.value}
                onClick={() => setTheme(item.value)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-950/30 border-purple-500/70 shadow-sm shadow-purple-950/50'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-purple-400 bg-purple-500'
                          : 'border-zinc-600 bg-zinc-800'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs font-bold text-white">{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-5 leading-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input 4 & 5: Tone & Length */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* Tone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gaya Bahasa (Tone)</span>
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneKey)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-600 focus:border-purple-500 text-xs text-zinc-100 outline-none transition-all cursor-pointer"
          >
            {TONE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Thread Length */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Panjang Utas</span>
          </label>
          <select
            value={threadLength}
            onChange={(e) => setThreadLength(Number(e.target.value) as ThreadLengthOption)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 hover:border-zinc-600 focus:border-purple-500 text-xs text-zinc-100 outline-none transition-all cursor-pointer font-medium"
          >
            <option value={5}>5 Utas (Standar - Link di #5)</option>
            <option value={6}>6 Utas (Link di #5)</option>
            <option value={7}>7 Utas (Maksimal - Link di #5)</option>
          </select>
        </div>
      </div>

      {/* Generate Button with Credit Cost Notice */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || isInsufficientCredit || !productInfo.trim()}
          className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-[0.99] ${
            isLoading
              ? 'bg-purple-900/50 text-purple-300 border border-purple-800 cursor-wait'
              : isInsufficientCredit
              ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
              : !productInfo.trim()
              ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white shadow-purple-600/30'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
              <span>Menyusun Utas Viral Threads...</span>
            </>
          ) : isInsufficientCredit ? (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Kredit Tidak Cukup (Perlu 5 Kredit)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Buat Utas Threads Sekarang</span>
              <span className="ml-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/30 border border-white/20 text-purple-200">
                5 Kredit
              </span>
            </>
          )}
        </button>

        {/* Small Helper Text */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Biaya: 5 Kredit per generasi
          </span>
          <span className="font-medium text-zinc-300">
            Sisa Saldo: <strong className={userCredits < 10 ? 'text-rose-400' : 'text-emerald-400'}>{userCredits}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
