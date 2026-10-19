import React from 'react';
import { HelpCircle, X, ShieldCheck, Flame, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Panduan Algoritma & Formula Utas Viral Affiliator
              </h2>
              <p className="text-xs text-zinc-400">
                Strategi psikologi copywriting Threads dengan konversi checkout tinggi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300 leading-relaxed">
          {/* Rule of Thread #5 */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-600/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Mengapa Link Affiliate WAJIB di Utas Ke-5?</span>
            </div>
            <p>
              Platform seperti Instagram Threads dan X sengaja <strong className="text-white">menurunkan jangkauan (shadowban / reach drop)</strong> jika post pertama sudah mengandung link keluar.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Algoritma Friendly:</strong> Utas 1–4 memicu interaksi murni (likes, replies, shares) tanpa ada penalti link eksternal.
              </li>
              <li>
                <strong className="text-zinc-200">Retensi Tertinggi:</strong> Pembaca yang mencapai balasan ke-5 adalah audiens paling hangat (warm leads) yang memiliki intensi checkout paling tinggi.
              </li>
              <li>
                <strong className="text-zinc-200">Anti-Spam:</strong> Terdengar seperti rekomendasi tulus dari teman, bukan iklan sponsor hard-selling.
              </li>
            </ul>
          </div>

          {/* 5-Step Anatomy */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Anatomi 5-7 Utas Berkonversi Tinggi
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-white block">Utas #1: Hook 3 Detik</strong>
                  <span className="text-zinc-400">
                    Bikin stop scrolling pembaca dengan kalimat provokatif, rasa penasaran, atau kontra-intuitif.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-white block">Utas #2: Agitasi Masalah & Curhat Relatable</strong>
                  <span className="text-zinc-400">
                    Bahas rasa insecure, kesalahan umum, atau keraguan yang sering dialami banyak orang.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-white block">Utas #3: Pengalaman Nyata & Bukti</strong>
                  <span className="text-zinc-400">
                    Review jujur, tekstur, performa, atau hasil penggunaan setelah beberapa waktu.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <strong className="text-white block">Utas #4: Tips Praktis & Edukasi</strong>
                  <span className="text-zinc-400">
                    Cara pemakaian yang tepat agar hasil maksimal dan tidak mubazir.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-600/30 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">
                  5
                </span>
                <div>
                  <strong className="text-emerald-300 block">Utas #5: Rekomendasi & Link Affiliate (CTA Natural)</strong>
                  <span className="text-zinc-400">
                    "Btw gue checkout di toko resminya lagi promo di sini ya: [link]"
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0">
                  6-7
                </span>
                <div>
                  <strong className="text-white block">Utas #6 & #7: Penutup & Pancing Diskusi Komentar</strong>
                  <span className="text-zinc-400">
                    Memicu komentar pembaca ("Kalian tim mana?"), algoritma Threads menyukai postingan dengan balasan aktif!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-2.5 text-zinc-400">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-zinc-200">Tips Format:</strong> Tiap baris diberi jarak spasi 1 baris (enter) agar nyaman di mata saat dibaca di layar smartphone. Batasi tiap utas maksimal 500 karakter.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
          >
            Mengerti, Siap Buat Utas
          </button>
        </div>
      </div>
    </div>
  );
};
