export type ThemeKey = 'edukasi' | 'review' | 'fomo' | 'promo' | 'battle';

export interface ThemeOption {
  value: ThemeKey;
  label: string;
  badge: string;
  description: string;
  iconName: string;
}

export type ToneKey =
  | 'santai akrab (gue/lo, ngobrol)'
  | 'kasual sopan (aku/kamu)'
  | 'dramatis storytelling'
  | 'singkat to-the-point'
  | 'genz viral (racun/spill)';

export interface ToneOption {
  value: ToneKey;
  label: string;
  description: string;
}

export type ThreadLengthOption = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ThreadPost {
  id: number;
  content: string;
  charCount: number;
  isAffiliatePost: boolean;
  isOverLimit: boolean;
}

export interface ThreadMetadata {
  hookScore: number;
  viralAngle: string;
  hashtags: string[];
  advice: string;
  tokensUsed?: number;
  creditsCharged: number;
}

export interface GeneratedThread {
  id: string;
  timestamp: number;
  productInfo: string;
  affiliateLink: string;
  theme: ThemeKey;
  tone: string;
  posts: string[];
  metadata: ThreadMetadata;
  tags?: string[];
}

export type TransactionType = 'generation' | 'regeneration' | 'hooks' | 'bonus' | 'reset' | 'topup';

export interface CreditTransaction {
  id: string;
  timestamp: number;
  type: TransactionType;
  amount: number; // negative for deduction, positive for addition
  balanceAfter: number;
  description: string;
}

export interface CreditState {
  balance: number;
  maxDailyQuota: number;
  totalUsedToday: number;
  lastResetDate: string; // YYYY-MM-DD
  transactions: CreditTransaction[];
}

export interface ProductPreset {
  id: string;
  category: string;
  title: string;
  productInfo: string;
  affiliateLink: string;
  recommendedTheme: ThemeKey;
  recommendedTone: ToneKey;
}

export interface ErrorDetail {
  title: string;
  message: string;
  statusCode?: number;
  statusText?: string;
  endpoint?: string;
  code?: string;
  detail?: string;
  suggestion?: string;
  timestamp: number;
}

