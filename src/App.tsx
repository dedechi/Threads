/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ThemeKey,
  ToneKey,
  ThreadLengthOption,
  GeneratedThread,
  CreditState,
} from './types';
import {
  loadCreditState,
  deductCredits,
  addCredits,
  resetCreditBalance,
} from './utils/creditManager';
import { Header } from './components/Header';
import { GeneratorForm } from './components/GeneratorForm';
import { ThreadResults } from './components/ThreadResults';
import { CreditModal } from './components/CreditModal';
import { SavedDraftsModal } from './components/SavedDraftsModal';
import { GuideModal } from './components/GuideModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Flame,
  CheckCircle,
} from 'lucide-react';

const DRAFTS_STORAGE_KEY = 'thread_generator_v2_drafts';

export default function App() {
  // Input form state
  const [productInfo, setProductInfo] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [theme, setTheme] = useState<ThemeKey>('edukasi');
  const [tone, setTone] = useState<ToneKey>('santai akrab (gue/lo, ngobrol)');
  const [threadLength, setThreadLength] = useState<ThreadLengthOption>(5);

  // App & Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [generatedThread, setGeneratedThread] = useState<GeneratedThread | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<GeneratedThread[]>([]);

  // Credit State
  const [creditState, setCreditState] = useState<CreditState>(loadCreditState());

  // Modals state
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load saved drafts on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (raw) {
        setSavedDrafts(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to parse drafts', e);
    }
  }, []);

  // Save drafts helper
  const updateSavedDrafts = (drafts: GeneratedThread[]) => {
    setSavedDrafts(drafts);
    try {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.error('Failed to save drafts', e);
    }
  };

  // Handle Generate Thread (Costs 5 Credits)
  const handleGenerateThread = async () => {
    if (!productInfo.trim()) {
      addToast('error', 'Harap isi deskripsi atau link produk terlebih dahulu!');
      return;
    }

    // Check credits
    if (creditState.balance < 5) {
      setIsCreditModalOpen(true);
      addToast(
        'error',
        `Kredit tidak mencukupi (sisa ${creditState.balance}). Anda butuh 5 kredit untuk membuat utas baru.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productInfo,
          affiliateLink,
          theme,
          tone,
          threadLength,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Terjadi kesalahan saat membuat utas.');
      }

      const data = await res.json();

      // Deduct 5 credits upon successful generation
      const deductRes = deductCredits(
        5,
        `Generate Utas (${theme.toUpperCase()} - ${productInfo.slice(0, 24)}...)`,
        'generation'
      );
      setCreditState(loadCreditState());

      const newThread: GeneratedThread = {
        id: `th-${Date.now()}`,
        timestamp: Date.now(),
        productInfo,
        affiliateLink,
        theme,
        tone,
        posts: data.posts,
        metadata: data.metadata,
      };

      setGeneratedThread(newThread);
      addToast('success', '✨ Utas Threads berhasil dibuat! Link diamankan di Utas #5 (-5 Kredit)');
    } catch (err: any) {
      console.error('Generation error:', err);
      addToast('error', err.message || 'Gagal membuat utas. Silakan coba beberapa saat lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle single post update (editing)
  const handleUpdatePost = (index: number, newContent: string) => {
    if (!generatedThread) return;
    const newPosts = [...generatedThread.posts];
    newPosts[index] = newContent;
    setGeneratedThread({
      ...generatedThread,
      posts: newPosts,
    });
    addToast('info', `Utas ke-${index + 1} berhasil diperbarui.`);
  };

  // Handle single post regeneration (Costs 1 Credit)
  const handleRegeneratePost = async (index: number, instruction: string) => {
    if (!generatedThread) return;

    if (creditState.balance < 1) {
      setIsCreditModalOpen(true);
      addToast('error', 'Kredit tidak mencukupi untuk regenerasi utas (butuh 1 kredit).');
      return;
    }

    try {
      const res = await fetch('/api/regenerate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postIndex: index,
          currentPost: generatedThread.posts[index],
          threadContext: generatedThread.posts,
          instruction,
          affiliateLink: generatedThread.affiliateLink,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal meregenerasi utas.');
      }

      const data = await res.json();
      deductCredits(1, `Regenerasi Utas #${index + 1}`, 'regeneration');
      setCreditState(loadCreditState());

      const updatedPosts = [...generatedThread.posts];
      updatedPosts[index] = data.newContent;
      setGeneratedThread({
        ...generatedThread,
        posts: updatedPosts,
      });

      addToast('success', `Utas #${index + 1} berhasil diregenerasi (-1 Kredit).`);
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Gagal meregenerasi utas.');
    }
  };

  // Handle generate alternative hooks (Costs 1 Credit)
  const handleGenerateHookVariations = async (): Promise<string[]> => {
    if (!generatedThread) return [];

    if (creditState.balance < 1) {
      setIsCreditModalOpen(true);
      addToast('error', 'Kredit tidak mencukupi untuk variasi hook (butuh 1 kredit).');
      return [];
    }

    try {
      const res = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productInfo: generatedThread.productInfo,
          theme: generatedThread.theme,
          tone: generatedThread.tone,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal membuat variasi hook.');
      }

      const data = await res.json();
      deductCredits(1, 'Eksplorasi 3 Variasi Hook Viral', 'hooks');
      setCreditState(loadCreditState());

      addToast('success', '3 Variasi Hook berhasil dibuat (-1 Kredit).');
      return data.hooks || [];
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Gagal memuat variasi hook.');
      return [];
    }
  };

  // Save current thread to drafts
  const handleSaveToDrafts = () => {
    if (!generatedThread) return;
    const exists = savedDrafts.some((d) => d.id === generatedThread.id);
    if (exists) {
      addToast('info', 'Utas ini sudah tersimpan di draft.');
      return;
    }
    const updated = [generatedThread, ...savedDrafts];
    updateSavedDrafts(updated);
    addToast('success', 'Utas berhasil disimpan ke Draft!');
  };

  // Credit manual additions / resets
  const handleAddCredits = (amount: number, description: string) => {
    addCredits(amount, description);
    setCreditState(loadCreditState());
  };

  const handleResetCredits = () => {
    resetCreditBalance(50);
    setCreditState(loadCreditState());
  };

  const isCurrentThreadSaved = generatedThread
    ? savedDrafts.some((d) => d.id === generatedThread.id)
    : false;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e2e8f0] flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        creditState={creditState}
        onOpenCreditModal={() => setIsCreditModalOpen(true)}
        onOpenDraftsModal={() => setIsDraftsModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        draftCount={savedDrafts.length}
      />

      {/* Main Container */}
      <main className="grow max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column (6/12): Input Form */}
          <div className="lg:col-span-5 space-y-4">
            <GeneratorForm
              productInfo={productInfo}
              setProductInfo={setProductInfo}
              affiliateLink={affiliateLink}
              setAffiliateLink={setAffiliateLink}
              theme={theme}
              setTheme={setTheme}
              tone={tone}
              setTone={setTone}
              threadLength={threadLength}
              setThreadLength={setThreadLength}
              isLoading={isLoading}
              onGenerate={handleGenerateThread}
              userCredits={creditState.balance}
            />
          </div>

          {/* Right Column (7/12): Output Stream / Preview */}
          <div className="lg:col-span-7">
            {generatedThread ? (
              <ThreadResults
                thread={generatedThread}
                onUpdatePost={handleUpdatePost}
                onRegeneratePost={handleRegeneratePost}
                onGenerateHookVariations={handleGenerateHookVariations}
                onSaveToDrafts={handleSaveToDrafts}
                isSaved={isCurrentThreadSaved}
                userCredits={creditState.balance}
              />
            ) : (
              /* Empty Placeholder State with Affiliator Selling Points */
              <div className="p-8 sm:p-12 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 text-center space-y-6">
                <div className="relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl shadow-purple-950/50">
                  <Sparkles className="w-8 h-8" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Siap Mengubah Produk Menjadi Utas Viral
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Ketik deskripsi produk atau pilih salah satu <strong>Contoh Cepat</strong> di formulir kiri, lalu klik{' '}
                    <span className="text-purple-300 font-semibold">"Buat Utas Threads Sekarang"</span>.
                  </p>
                </div>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Link Aman di #5</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Algoritma Threads ramah, bebas shadowban tanpa penalti link keluar di post 1.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Flame className="w-4 h-4" />
                      <span>Hook 3 Detik</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Diformulasikan menahan jempol audiens di feed dengan Hook viral score otomatis.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                      <Zap className="w-4 h-4" />
                      <span>Pelacak Kuota</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Pantau sisa kuota kredit tim internal, riwayat pemakaian, dan reload fleksibel.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      // Apply sample 1
                      setProductInfo(
                        'Skintific All Day Light Sunscreen Mist SPF 50 PA++++, tekstur kabut halus tanpa merusak makeup, ada ceramide & centella, travel friendly 50ml, cocok buat re-apply outdoor.'
                      );
                      setAffiliateLink('https://shope.ee/skintific-sunscreen-official');
                      setTheme('edukasi');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all shadow-sm"
                  >
                    <span>Muat Contoh Cepat: Sunscreen Spray Skintific</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-850 bg-[#0b0c10] py-4 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Thread Generator Ver.2 • Internal Affiliate Content Suite</p>
          <p className="flex items-center gap-1 text-[11px] text-zinc-400">
            Powered by Google Gemini 3.8 Flash • Threads Copywriting Engine
          </p>
        </div>
      </footer>

      {/* Modals */}
      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        creditState={creditState}
        onAddCredits={handleAddCredits}
        onResetCredits={handleResetCredits}
      />

      <SavedDraftsModal
        isOpen={isDraftsModalOpen}
        onClose={() => setIsDraftsModalOpen(false)}
        drafts={savedDrafts}
        onSelectDraft={(draft) => setGeneratedThread(draft)}
        onDeleteDraft={(id) => {
          const updated = savedDrafts.filter((d) => d.id !== id);
          updateSavedDrafts(updated);
          addToast('info', 'Draft berhasil dihapus.');
        }}
        onClearAllDrafts={() => {
          updateSavedDrafts([]);
          addToast('info', 'Semua draft berhasil dibersihkan.');
        }}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Toast Feedback Messages */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
