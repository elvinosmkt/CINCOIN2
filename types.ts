
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'company' | 'admin';
  balance: number; // Saldo em CNC
  fiatBalance: number; // Saldo em BRL (simulado para a corretora/banco)
  pendingBonus: number; // Bônus aguardando validação
  kycStatus: 'pending' | 'verified' | 'unverified';
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'buy' | 'deposit' | 'exchange' | 'invest';
  amount: number;
  currency: 'CNC' | 'BRL'; 
  date: string;
  status: 'completed' | 'pending' | 'failed';
  counterparty: string;
  details?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  totalPriceBRL: number;
  cncPercentage: number; // Ex: 50% aceito em CNC
  image: string;
  category: string;
}

export interface BankAsset {
  id: string;
  name: string;
  type: 'cdi' | 'consortium' | 'crypto_fund';
  balance: number;
  profitability: string; // Ex: "+12% a.a"
  status: 'active' | 'pending';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  theme: 'light' | 'dark';
  login: (user: User, token: string) => void;
  logout: () => void;
  toggleTheme: () => void;
}

export type CompanyStatus = 'ACTIVE' | 'PENDING_VALIDATION' | 'REJECTED';

export interface Company {
  id: number | string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  percentCincoin: number;
  percentBRL: number;
  address: string;
  city: string;
  state: string;
  phone: string;
  image: string;
  rating: number;
  totalReviews: number;
  status?: CompanyStatus;
  
  // Admin fields
  cnpj?: string;
  cnpjCardUrl?: string;
  documentPhotoUrl?: string;
  ownerName?: string;
  requestDate?: string;
}

export interface SellOrder {
  id: string;
  amount: number;
  price: number;
  totalBrl: number;
  date: string;
  status: 'waiting' | 'processing' | 'completed';
  positionInQueue?: number;
}

export interface Referral {
  id: string;
  name: string;
  date: string;
  status: 'verified' | 'pending'; // verificado = conta validada (gera bonus)
}

export interface Commission {
  id: string;
  referrerName: string; // Quem indicou
  refereeName: string;  // Quem entrou/comprou
  type: 'SIGNUP_BONUS' | 'PURCHASE_COMMISSION';
  amount: number;
  baseValue?: number; // Valor da compra original (se aplicável)
  percentage?: number; // % da comissão aplicada
  date: string;
  status: 'PAID' | 'PENDING';
}

export interface SystemFees {
  transferFeePercent: number;
  withdrawalFeePercent: number;
}
