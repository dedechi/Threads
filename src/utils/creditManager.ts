import { CreditState, CreditTransaction, TransactionType } from '../types';

const STORAGE_KEY = 'thread_generator_v2_credits';
const DEFAULT_INITIAL_BALANCE = 50;
const DEFAULT_DAILY_QUOTA = 50;

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function loadCreditState(): CreditState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = getTodayString();

    if (!raw) {
      const initial: CreditState = {
        balance: DEFAULT_INITIAL_BALANCE,
        maxDailyQuota: DEFAULT_DAILY_QUOTA,
        totalUsedToday: 0,
        lastResetDate: today,
        transactions: [
          {
            id: 'tx-welcome',
            timestamp: Date.now(),
            type: 'bonus',
            amount: DEFAULT_INITIAL_BALANCE,
            balanceAfter: DEFAULT_INITIAL_BALANCE,
            description: 'Saldo awal kuota affiliator internal',
          },
        ],
      };
      saveCreditState(initial);
      return initial;
    }

    const state = JSON.parse(raw) as CreditState;

    // Check if new day for reset of today's usage counter
    if (state.lastResetDate !== today) {
      state.totalUsedToday = 0;
      state.lastResetDate = today;
      saveCreditState(state);
    }

    return state;
  } catch (err) {
    console.error('Failed to load credit state:', err);
    return {
      balance: DEFAULT_INITIAL_BALANCE,
      maxDailyQuota: DEFAULT_DAILY_QUOTA,
      totalUsedToday: 0,
      lastResetDate: getTodayString(),
      transactions: [],
    };
  }
}

export function saveCreditState(state: CreditState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save credit state:', err);
  }
}

export function deductCredits(
  amount: number,
  description: string,
  type: TransactionType = 'generation'
): { success: boolean; newBalance: number; error?: string } {
  const state = loadCreditState();

  if (state.balance < amount) {
    return {
      success: false,
      newBalance: state.balance,
      error: `Kredit tidak mencukupi! Anda memiliki ${state.balance} kredit, namun aksi ini membutuhkan ${amount} kredit.`,
    };
  }

  state.balance -= amount;
  state.totalUsedToday += amount;

  const tx: CreditTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    type,
    amount: -amount,
    balanceAfter: state.balance,
    description,
  };

  state.transactions.unshift(tx);
  // Keep last 50 transactions
  if (state.transactions.length > 50) {
    state.transactions = state.transactions.slice(0, 50);
  }

  saveCreditState(state);
  return { success: true, newBalance: state.balance };
}

export function addCredits(
  amount: number,
  description: string,
  type: TransactionType = 'topup'
): { newBalance: number } {
  const state = loadCreditState();
  state.balance += amount;

  const tx: CreditTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    type,
    amount,
    balanceAfter: state.balance,
    description,
  };

  state.transactions.unshift(tx);
  if (state.transactions.length > 50) {
    state.transactions = state.transactions.slice(0, 50);
  }

  saveCreditState(state);
  return { newBalance: state.balance };
}

export function resetCreditBalance(newBalance: number = DEFAULT_INITIAL_BALANCE): CreditState {
  const state = loadCreditState();
  state.balance = newBalance;
  state.totalUsedToday = 0;

  const tx: CreditTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    type: 'reset',
    amount: newBalance,
    balanceAfter: newBalance,
    description: `Reset kuota harian ke ${newBalance} kredit`,
  };

  state.transactions.unshift(tx);
  saveCreditState(state);
  return state;
}
