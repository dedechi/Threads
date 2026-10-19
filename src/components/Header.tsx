import React from 'react';
import {
  Zap,
  Bookmark,
  Sparkles,
  HelpCircle,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { CreditState } from '../types';

interface HeaderProps {
  creditState: CreditState;
  onOpenCreditModal: () => void;
  onOpenDraftsModal: () => void;
  onOpenGuideModal: () => void;
  draftCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  creditState,
  onOpenCreditModal,
  onOpenDraftsModal,
  onOpenGuideModal,
  draftCount,
}) => {
  const isLowCredit = creditState.balance < 10;
  const isModerateCredit = creditState.balance >= 10 && creditState.balance < 25;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0b0c10]/85 border-b border-zinc-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Badges */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-lg shadow-purple-600/20 text-white font-extrabold text-lg tracking-wider">
            <span>@</span>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0b0c10]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Thread Generator
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40">
                  Ver. 2.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
              <span>Ubah produk/link jadi Utas Viral dalam Sekejap</span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3 h-3" /> Link di Utas #5 Otomatis
              </span>
            </p>
          </div>
        </div>

        {/* Right: Credit System & Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
          {/* Credit Capsule Widget */}
          <button
            onClick={onOpenCreditModal}
            className={`group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all shadow-sm ${
              isLowCredit
                ? 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-600/50 text-rose-200 shadow-rose-900/20'
                : isModerateCredit
                ? 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-600/50 text-amber-200 shadow-amber-900/20'
                : 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-700/80 text-zinc-200 hover:border-purple-500/50 shadow-black/40'
            }`}
            title="Klik untuk melihat rincian pemakaian kuota kredit"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`p-1 rounded-lg ${
                  isLowCredit
                    ? 'bg-rose-500/20 text-rose-400'
                    : isModerateCredit
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
              </span>
              <div className="text-left">
                <span className="text-[10px] block leading-none text-zinc-400 font-normal">Sisa Kredit</span>
                <span className="font-bold tracking-tight text-white">
                  {creditState.balance}{' '}
                  <span className="text-zinc-500 font-normal text-xs">/ {creditState.maxDailyQuota}</span>
                </span>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-0.5 pl-1.5 border-l border-zinc-700/60">
              <span className="text-[10px] text-zinc-400">Hari ini:</span>
              <span className="text-[11px] font-semibold text-zinc-300">-{creditState.totalUsedToday} dipakai</span>
            </div>

            <span className="hidden sm:inline-flex items-center justify-center w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white transition-colors ml-1">
              <PlusCircle className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Saved Drafts */}
          <button
            onClick={onOpenDraftsModal}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
            title="Draft Utas Tersimpan"
          >
            <Bookmark className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Draft Utas</span>
            {draftCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                {draftCount}
              </span>
            )}
          </button>

          {/* Guide / How to */}
          <button
            onClick={onOpenGuideModal}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Panduan Affiliator & Algoritma Threads"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
