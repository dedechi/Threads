import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Bookmark,
  Sparkles,
  Smartphone,
  Edit3,
  RefreshCw,
  Flame,
  CheckCircle2,
  AlertCircle,
  Hash,
  Share2,
  Zap,
} from 'lucide-react';
import { GeneratedThread } from '../types';
import { ThreadsMobileMockup } from './ThreadsMobileMockup';

interface ThreadResultsProps {
  thread: GeneratedThread;
  onUpdatePost: (index: number, newContent: string) => void;
  onRegeneratePost: (index: number, instruction: string) => Promise<void>;
  onGenerateHookVariations: () => Promise<string[]>;
  onSaveToDrafts: () => void;
  isSaved: boolean;
  userCredits: number;
  onShowToast?: (type: 'success' | 'error' | 'info', message: string) => void;
  onOpenCreditModal?: () => void;
}

export const ThreadResults: React.FC<ThreadResultsProps> = ({
  thread,
  onUpdatePost,
  onRegeneratePost,
  onGenerateHookVariations,
  onSaveToDrafts,
  isSaved,
  userCredits,
  onShowToast,
  onOpenCreditModal,
}) => {
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('preview');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPostIndex, setCopiedPostIndex] = useState<number | null>(null);

  // Editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');

  // Regenerate single post state
  const [regenIndex, setRegenIndex] = useState<number | null>(null);
  const [regenInstruction, setRegenInstruction] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Hook variations state
  const [hookVariations, setHookVariations] = useState<string[]>([]);
  const [isLoadingHooks, setIsLoadingHooks] = useState(false);
  const [showHooksDropdown, setShowHooksDropdown] = useState(false);

  const posts = thread.posts;

  // Copy all posts formatted with V1 JSON separator
  const handleCopyAll = () => {
    const separator = '\n\n-------------------------\n\n';
    const allText = posts.join(separator);
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Copy single post
  const handleCopySingle = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedPostIndex(index);
    setTimeout(() => setCopiedPostIndex(null), 2000);
  };

  // Download as TXT file
  const handleDownloadTxt = () => {
    const separator = '\n\n-------------------------\n\n';
    const content = `THREAD GENERATOR VER.2\nTanggal: ${new Date(
      thread.timestamp
    ).toLocaleString('id-ID')}\nTema: ${thread.theme}\nProduk: ${
      thread.productInfo
    }\nLink Affiliate: ${thread.affiliateLink || 'Default bio'}\n\n` +
      posts.map((p, i) => `[Utas ${i + 1} dari ${posts.length}]\n${p}`).join(separator);

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `threads-${thread.theme}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Start inline editing
  const handleStartEdit = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditingContent(currentText);
  };

  const handleSaveEdit = (index: number) => {
    onUpdatePost(index, editingContent);
    setEditingIndex(null);
  };

  // Handle regenerating a single post
  const handleExecuteRegenerate = async (index: number) => {
    if (userCredits < 1) {
      if (onShowToast) {
        onShowToast('error', 'Kredit tidak mencukupi untuk regenerasi utas (membutuhkan 1 kredit).');
      }
      if (onOpenCreditModal) {
        onOpenCreditModal();
      }
      return;
    }
    setIsRegenerating(true);
    try {
      await onRegeneratePost(index, regenInstruction);
      setRegenIndex(null);
      setRegenInstruction('');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Handle generating hooks
  const handleFetchHooks = async () => {
    if (userCredits < 1) {
      if (onShowToast) {
        onShowToast('error', 'Kredit tidak mencukupi untuk variasi hook (membutuhkan 1 kredit).');
      }
      if (onOpenCreditModal) {
        onOpenCreditModal();
      }
      return;
    }
    setIsLoadingHooks(true);
    try {
      const hooks = await onGenerateHookVariations();
      setHookVariations(hooks);
      setShowHooksDropdown(true);
    } finally {
      setIsLoadingHooks(false);
    }
  };

  const handleApplyHook = (newHook: string) => {
    onUpdatePost(0, newHook);
    setShowHooksDropdown(false);
  };

  const hookScore = thread.metadata?.hookScore || 85;

  return (
    <div className="space-y-4">
      {/* Top Banner: Hook Score & Quick Actions */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Viral Hook Rating Badge */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/20 to-pink-500/20 border border-amber-500/30 text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Viral Hook Score
                </span>
                <span className="text-sm font-extrabold text-amber-400">
                  {hookScore}/100
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-medium">
                {hookScore >= 90
                  ? 'Potensi Viral Sangat Tinggi 🔥 (Hook 3 detik sangat kuat)'
                  : hookScore >= 80
                  ? 'Potensi Baik 👍 (Relatable & memicu rasa penasaran)'
                  : 'Cukup Bagus (Bisa diperkuat dengan hook alternatif)'}
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Preview Threads</span>
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'editor'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor Utas</span>
            </button>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyAll}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                copiedAll
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white border border-zinc-700'
              }`}
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Semua Utas Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Salin Semua Utas</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
              title="Unduh file .txt"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Download .txt</span>
            </button>

            <button
              onClick={onSaveToDrafts}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                isSaved
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-purple-400 fill-current' : 'text-zinc-400'}`} />
              <span>{isSaved ? 'Tersimpan di Draft' : 'Simpan ke Draft'}</span>
            </button>
          </div>

          {/* Hook Variations Trigger (1 Credit) */}
          <div className="relative">
            <button
              onClick={handleFetchHooks}
              disabled={isLoadingHooks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all active:scale-95"
            >
              {isLoadingHooks ? (
                <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Flame className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Variasi Hook Lain</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200">
                1 Kredit
              </span>
            </button>

            {/* Dropdown with generated alternative hooks */}
            {showHooksDropdown && hookVariations.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl z-30 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Pilih Alternatif Hook:
                  </span>
                  <button
                    onClick={() => setShowHooksDropdown(false)}
                    className="text-zinc-500 hover:text-zinc-300 text-xs"
                  >
                    Tutup
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {hookVariations.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 space-y-1.5"
                    >
                      <p className="text-xs text-zinc-200 leading-relaxed font-medium">"{h}"</p>
                      <button
                        onClick={() => handleApplyHook(h)}
                        className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Terapkan ke Utas #1
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Hashtags */}
        {thread.metadata?.hashtags && thread.metadata.hashtags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Hash className="w-3 h-3" /> Tag Rekomendasi:
            </span>
            {thread.metadata.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content View */}
      {viewMode === 'preview' ? (
        <ThreadsMobileMockup
          posts={posts}
          affiliateLink={thread.affiliateLink}
          onCopyPost={handleCopySingle}
          copiedIndex={copiedPostIndex}
        />
      ) : (
        /* Editor Cards List */
        <div className="space-y-3.5">
          {posts.map((postContent, index) => {
            const affiliateIndex = posts.length < 5 ? posts.length - 1 : 4;
            const isAffiliatePost = index === affiliateIndex;
            const charCount = postContent.length;
            const isOverLimit = charCount > 500;
            const isEditing = editingIndex === index;
            const isRegenActive = regenIndex === index;

            return (
              <div
                key={index}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isAffiliatePost
                    ? 'bg-gradient-to-br from-emerald-950/20 via-zinc-950 to-zinc-950 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-zinc-950/70 border-zinc-800/90 hover:border-zinc-700'
                }`}
              >
                {/* Post Card Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-850">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isAffiliatePost
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      }`}
                    >
                      Utas {index + 1} dari {posts.length}
                    </span>

                    {isAffiliatePost && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        ⚡ Slot Link Affiliate ({posts.length < 5 ? (posts.length === 1 ? 'Utas Utama' : `Utas #${affiliateIndex + 1}`) : 'Utas Ke-5'})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Character counter (Threads 500 limit) */}
                    <span
                      className={`text-[11px] font-mono ${
                        isOverLimit
                          ? 'text-rose-400 font-bold'
                          : charCount > 400
                          ? 'text-amber-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      {charCount} / 500 Karakter
                    </span>

                    {/* Copy single post */}
                    <button
                      onClick={() => handleCopySingle(postContent, index)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Salin utas ini"
                    >
                      {copiedPostIndex === index ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Post Content Area */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-purple-500 text-xs sm:text-sm text-zinc-100 outline-none leading-relaxed resize-y font-normal"
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-zinc-200 whitespace-pre-line leading-relaxed font-normal">
                    {postContent}
                  </div>
                )}

                {/* Regenerate Panel (Accordion) */}
                {isRegenActive && (
                  <div className="mt-3 p-3 rounded-xl bg-zinc-900/90 border border-purple-500/40 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                        Instruksi Regenerasi Utas Ini
                      </span>
                      <span className="text-[10px] text-amber-300 font-semibold">
                        Biaya: 1 Kredit
                      </span>
                    </div>
                    <input
                      type="text"
                      value={regenInstruction}
                      onChange={(e) => setRegenInstruction(e.target.value)}
                      placeholder="Contoh: Buat lebih santai, tambahkan kata racun, perjelas kelebihan..."
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 outline-none"
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setRegenIndex(null)}
                        className="px-2.5 py-1 rounded-md text-zinc-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleExecuteRegenerate(index)}
                        disabled={isRegenerating}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 active:scale-95"
                      >
                        {isRegenerating ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3 fill-current" />
                            <span>Regenerate (1 Kredit)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Bottom Toolbar */}
                {!isEditing && !isRegenActive && (
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-900 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(index, postContent)}
                        className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 text-[11px] font-medium"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <span className="text-zinc-700">•</span>
                      <button
                        onClick={() => setRegenIndex(index)}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px] font-medium"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerasi (1 Kredit)
                      </button>
                    </div>

                    {isAffiliatePost && (
                      <span className="text-[10px] text-emerald-400 font-medium">
                        ✓ Link aman di {posts.length < 5 ? (posts.length === 1 ? 'utas utama' : `utas #${affiliateIndex + 1}`) : 'utas #5'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
