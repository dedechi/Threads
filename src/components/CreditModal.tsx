import React, { useState } from 'react';
import {
  Zap,
  X,
  History,
  TrendingDown,
  Gift,
  RotateCcw,
  Plus,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { CreditState } from '../types';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditState: CreditState;
  onAddCredits: (amount: number, description: string) => void;
  onResetCredits: () => void;
}

export const CreditModal: React.FC<CreditModalProps> = ({
  isOpen,
  onClose,
  creditState,
  onAddCredits,
  onResetCredits,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const percentageLeft = Math.min(
    100,
    Math.round((creditState.balance / creditState.maxDailyQuota) * 100)
  );

  const handleClaimBonus = () => {
    onAddCredits(25, 'Klaim Bonus Kuota Harian Affiliator');
    setFeedbackMsg('🎉 Berhasil klaim +25 Kredit bonus harian!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleTopUp = () => {
    onAddCredits(50, 'Isi Ulang Kuota Internal (+50 Kredit)');
    setFeedbackMsg('⚡ Berhasil menambah +50 Kredit internal!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleReset = () => {
    onResetCredits();
    setFeedbackMsg('🔄 Kuota berhasil di-reset ke 50 Kredit!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const filteredTransactions = creditState.transactions.filter((tx) => {
    if (filterType === 'all') return true;
    if (filterType === 'usage') return tx.amount < 0;
    if (filterType === 'topup') return tx.amount > 0;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Manajemen Kuota & Kredit Pemakaian
              </h2>
              <p className="text-xs text-zinc-400">
                Informasi sisa kredit, tarif penggunaan, dan riwayat aktivitas affiliator
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

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className="bg-emerald-950/70 border-b border-emerald-800/80 px-6 py-2.5 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Credit Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Sisa Saldo */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-16 h-16 text-purple-400" />
              </div>
              <span className="text-xs text-zinc-400 font-medium block mb-1">Sisa Saldo Kredit</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {creditState.balance}
                </span>
                <span className="text-xs text-zinc-500">Kredit</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>Kapasitas Quota</span>
                  <span className="font-medium text-zinc-300">{percentageLeft}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      creditState.balance < 10
                        ? 'bg-rose-500'
                        : creditState.balance < 25
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    }`}
                    style={{ width: `${Math.max(percentageLeft, 5)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Terpakai Hari Ini */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-xs text-zinc-400 font-medium block mb-1">Terpakai Hari Ini</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-amber-400 tracking-tight">
                    {creditState.totalUsedToday}
                  </span>
                  <span className="text-xs text-zinc-500">Kredit</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Otomatis dihitung per generasi</span>
              </div>
            </div>

            {/* Total Utas Terbuat */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-xs text-zinc-400 font-medium block mb-1">Status Akun Internal</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Affiliate Tier Pro
                  </span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Reset kuota otomatis tiap hari</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Simulate internal team reload) */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Aksi Kuota & Isi Ulang Simulasi
              </span>
              <span className="text-[11px] text-zinc-400">Internal Environment</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleClaimBonus}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-900/30 active:scale-95"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Klaim Bonus (+25)</span>
              </button>
              <button
                onClick={handleTopUp}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold border border-zinc-700 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Isi Ulang (+50)</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-800 transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reset ke 50</span>
              </button>
            </div>
          </div>

          {/* Cost Reference (Tarif Penggunaan) */}
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Daftar Konsumsi Kredit Per Fitur</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white block">Buat Utas Lengkap</span>
                  <span className="text-[11px] text-zinc-400">5-7 Utas + Link #5</span>
                </div>
                <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  5 Kredit
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white block">Regenerasi 1 Utas</span>
                  <span className="text-[11px] text-zinc-400">Tweak kata / hook</span>
                </div>
                <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  1 Kredit
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-medium text-white block">3 Hook Alternatif</span>
                  <span className="text-[11px] text-zinc-400">A/B Testing Hook</span>
                </div>
                <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  1 Kredit
                </span>
              </div>
            </div>
          </div>

          {/* Transactions History Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-zinc-200">Riwayat Penggunaan & Kredit</span>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    filterType === 'all' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType('usage')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    filterType === 'usage' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Penggunaan
                </button>
                <button
                  onClick={() => setFilterType('topup')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    filterType === 'topup' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Isi Ulang
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden">
              {filteredTransactions.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs">
                  Belum ada riwayat transaksi yang tercatat.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/60 max-h-56 overflow-y-auto">
                  {filteredTransactions.map((tx) => {
                    const isDeduction = tx.amount < 0;
                    const date = new Date(tx.timestamp);
                    const formattedTime = date.toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const formattedDate = date.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    });

                    return (
                      <div
                        key={tx.id}
                        className="p-3 flex items-center justify-between text-xs hover:bg-zinc-900/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isDeduction
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-200 block">
                              {tx.description}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {formattedDate}, {formattedTime}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-bold font-mono ${
                              isDeduction ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {isDeduction ? `${tx.amount}` : `+${tx.amount}`}
                          </span>
                          <span className="block text-[10px] text-zinc-500">
                            Sisa: {tx.balanceAfter}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
