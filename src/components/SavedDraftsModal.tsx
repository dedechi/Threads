import React from 'react';
import { Bookmark, X, Trash2, ArrowUpRight, Copy, Check, Calendar } from 'lucide-react';
import { GeneratedThread } from '../types';

interface SavedDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: GeneratedThread[];
  onSelectDraft: (draft: GeneratedThread) => void;
  onDeleteDraft: (id: string) => void;
  onClearAllDrafts: () => void;
}

export const SavedDraftsModal: React.FC<SavedDraftsModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onSelectDraft,
  onDeleteDraft,
  onClearAllDrafts,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (draft: GeneratedThread, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = draft.posts.join('\n\n-------------------------\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedId(draft.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Draft Utas Tersimpan
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                  {drafts.length} Utas
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Akses kembali riwayat utas yang telah Anda buat sebelumnya
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
        <div className="p-6 overflow-y-auto space-y-3">
          {drafts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Bookmark className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-medium text-zinc-400">Belum ada draft utas yang disimpan</p>
              <p className="text-xs text-zinc-600">
                Setelah men-generate utas, Anda dapat menyimpannya ke daftar ini untuk digunakan kembali kapan saja.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-zinc-500 pb-1">
                <span>Daftar Riwayat Utas</span>
                <button
                  onClick={onClearAllDrafts}
                  className="text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
                </button>
              </div>

              {drafts.map((draft) => {
                const date = new Date(draft.timestamp);
                const formattedDate = date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={draft.id}
                    onClick={() => {
                      onSelectDraft(draft);
                      onClose();
                    }}
                    className="group p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {draft.productInfo}
                          </span>
                          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {draft.theme.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formattedDate}
                          </span>
                          <span>•</span>
                          <span>{draft.posts.length} Utas</span>
                          <span>•</span>
                          <span className="text-amber-400 font-medium">
                            Hook Score: {draft.metadata.hookScore}/100
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleCopy(draft, e)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Salin Semua Utas"
                        >
                          {copiedId === draft.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDraft(draft.id);
                          }}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-900/40 text-zinc-400 hover:text-rose-300 transition-colors"
                          title="Hapus Draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-purple-600/20 group-hover:bg-purple-600 text-purple-300 group-hover:text-white transition-colors"
                          title="Buka Utas"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preview post 1 */}
                    <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-850 text-xs text-zinc-300 line-clamp-2 italic">
                      "{draft.posts[0]}"
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
