import React from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
} from 'lucide-react';

interface ThreadsMobileMockupProps {
  posts: string[];
  affiliateLink: string;
  onCopyPost: (content: string, index: number) => void;
  copiedIndex: number | null;
}

export const ThreadsMobileMockup: React.FC<ThreadsMobileMockupProps> = ({
  posts,
  affiliateLink,
  onCopyPost,
  copiedIndex,
}) => {
  return (
    <div className="max-w-md mx-auto bg-black border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden font-sans">
      {/* Mobile Top Notch bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-900 text-zinc-500 text-[11px] mb-2">
        <span className="font-semibold text-zinc-400">Threads Preview</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-zinc-400">Live Feed</span>
        </div>
      </div>

      {/* Thread list with connecting vertical line */}
      <div className="space-y-0 relative">
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          const isAffiliatePost = index === 4;

          return (
            <div key={index} className="relative flex gap-3 group pt-2 pb-4">
              {/* Left Column: Avatar & Vertical Connector Line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold border-2 border-black shadow-md">
                    AP
                  </div>
                  {/* Verified badge */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                </div>

                {/* Vertical Thread Connector Line */}
                {!isLast && (
                  <div className="w-0.5 grow bg-zinc-800 my-1 rounded-full group-hover:bg-zinc-700 transition-colors" />
                )}
              </div>

              {/* Right Column: Username, Post Content & Actions */}
              <div className="grow space-y-1.5 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                      affiliator_pro
                    </span>
                    <span className="text-[11px] text-zinc-500">2m</span>

                    {/* Post tag */}
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        isAffiliatePost
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800/80 text-zinc-400'
                      }`}
                    >
                      {index + 1}/{posts.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCopyPost(post, index)}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      title="Salin utas ini"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button className="text-zinc-600 hover:text-zinc-400 p-0.5">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content text */}
                <div
                  className={`text-xs sm:text-[13px] text-zinc-200 whitespace-pre-line leading-relaxed font-normal selection:bg-purple-900 ${
                    isAffiliatePost ? 'p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40' : ''
                  }`}
                >
                  {post}
                </div>

                {/* Post #5 Affiliate Pill Highlight */}
                {isAffiliatePost && (
                  <div className="pt-1">
                    <a
                      href={affiliateLink && affiliateLink.startsWith('http') ? affiliateLink : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all group/link"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="truncate max-w-[220px]">
                        {affiliateLink || 'Link Pembelian Resmi'}
                      </span>
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                )}

                {/* Threads Interaction Icons */}
                <div className="flex items-center gap-4 text-zinc-500 pt-1 text-[11px]">
                  <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{34 + index * 12}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{5 + index * 2}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                    <Repeat2 className="w-3.5 h-3.5" />
                    <span>{8 + index}</span>
                  </button>
                  <button className="hover:text-zinc-300 transition-colors ml-auto">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
