
import { User, Transaction, Product, BankAsset, SellOrder, Referral } from '../types';

// Utils
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// MOCK DATA
const MOCK_USER: User = {
  id: 'u_123',
  name: 'Alex Investidor',
  email: 'alex@cincoin.asia',
  role: 'user', 
  balance: 25420.50,
  fiatBalance: 1500.00,
  pendingBonus: 250.00, // 5 convites pendentes x 50 (exemplo)
  kycStatus: 'verified',
};

// Produtos com lógica de split (Híbrido)
const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p_1', 
    sellerId: 'c_1',
    sellerName: 'TechStore Premium',
    name: 'MacBook Pro M3', 
    description: 'Notebook Apple de última geração, lacrado.', 
    totalPriceBRL: 12000, 
    cncPercentage: 30, // Aceita 30% em cincoin
    category: 'Eletrônicos', 
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000' 
  },
  { 
    id: 'p_2', 
    sellerId: 'c_2',
    sellerName: 'Construtora Elite',
    name: 'Cota de Consórcio Imobiliário', 
    description: 'Entrada facilitada com Cincoin.', 
    totalPriceBRL: 50000, 
    cncPercentage: 50, // 50% em Cincoin
    category: 'Imóveis', 
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000' 
  },
  { 
    id: 'p_3', 
    sellerId: 'c_3',
    sellerName: 'Café do Futuro',
    name: 'Café Especial Torra Média', 
    description: 'Grãos selecionados do sul de minas.', 
    totalPriceBRL: 45, 
    cncPercentage: 100, // 100% em Cincoin
    category: 'Alimentos', 
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000' 
  },
  { 
    id: 'p_4', 
    sellerId: 'c_1',
    sellerName: 'TechStore Premium',
    name: 'iPhone 15 Pro', 
    description: 'Titânio natural, 256GB.', 
    totalPriceBRL: 7500, 
    cncPercentage: 20, 
    category: 'Eletrônicos', 
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000' 
  },
];

const MOCK_BANK_ASSETS: BankAsset[] = [
  { id: 'a_1', name: 'CDB Liquidez Diária', type: 'cdi', balance: 5000.00, profitability: '110% do CDI', status: 'active' },
  { id: 'a_2', name: 'Consórcio Auto (Grupo 504)', type: 'consortium', balance: 12500.00, profitability: 'N/A', status: 'active' },
];

const MOCK_SELL_QUEUE: SellOrder[] = [
  { id: 'so_1', amount: 500, price: 0.50, totalBrl: 250, date: '2023-10-25', status: 'waiting', positionInQueue: 145 },
  { id: 'so_2', amount: 1000, price: 0.50, totalBrl: 500, date: '2023-10-20', status: 'processing', positionInQueue: 5 },
];

const MOCK_REFERRALS: Referral[] = [
  { id: 'r_1', name: 'João Silva', date: '2023-10-24', status: 'verified' },
  { id: 'r_2', name: 'Maria Souza', date: '2023-10-25', status: 'pending' },
  { id: 'r_3', name: 'Pedro Santos', date: '2023-10-25', status: 'pending' },
];

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(1000);
      if (email === 'error@teste.com') throw new Error('Credenciais inválidas');
      return MOCK_USER;
    },
    register: async (data: any): Promise<User> => {
      await delay(1500);
      return MOCK_USER;
    }
  },
  user: {
    getProfile: async (): Promise<User> => {
      await delay(500);
      return MOCK_USER;
    },
    getTransactions: async (): Promise<Transaction[]> => {
      await delay(800);
      return [
        { id: 'tx_1', type: 'receive', amount: 500, currency: 'CNC', date: 'Hoje', status: 'completed', counterparty: 'CinExchange' },
        { id: 'tx_2', type: 'invest', amount: 1000, currency: 'BRL', date: 'Ontem', status: 'completed', counterparty: 'CinBank CDI' },
        { id: 'tx_3', type: 'buy', amount: 200, currency: 'CNC', date: '20/10/2023', status: 'completed', counterparty: 'CinPlace - TechStore' },
      ];
    },
    getBalanceHistory: async () => {
      await delay(600);
      return [
        { date: 'Jan', value: 10000 },
        { date: 'Fev', value: 12500 },
        { date: 'Mar', value: 11000 },
        { date: 'Abr', value: 15000 },
        { date: 'Mai', value: 20000 },
        { date: 'Jun', value: 25420 },
      ];
    },
    getReferrals: async (): Promise<Referral[]> => {
      await delay(600);
      return MOCK_REFERRALS;
    }
  },
  wallet: {
    send: async (amount: number, address: string) => {
      await delay(2000);
      return { success: true, txHash: '0x123...abc' };
    }
  },
  marketplace: {
    getProducts: async (): Promise<Product[]> => {
      await delay(800);
      return MOCK_PRODUCTS;
    },
    registerProduct: async (productData: any) => {
      await delay(1500);
      return { success: true };
    },
    buyProduct: async (productId: string) => {
      await delay(1500);
      return { success: true };
    }
  },
  bank: {
    getAssets: async (): Promise<BankAsset[]> => {
      await delay(600);
      return MOCK_BANK_ASSETS;
    },
    requestCard: async () => {
      await delay(1000);
      return { success: true };
    }
  },
  exchange: {
    // Nova lógica de preço fixo
    getAdminPrice: async () => {
      await delay(200);
      return {
        price: 0.50, // Preço fixo estabelecido pelo Admin
        currency: 'BRL',
        lastUpdate: new Date().toISOString()
      };
    },
    buyToken: async (amountCnc: number) => {
      await delay(1500);
      return { success: true };
    },
    sellToken: async (amountCnc: number) => {
      await delay(1500);
      // Entra na fila
      return { success: true, queuePosition: 152 };
    },
    getSellQueue: async (): Promise<SellOrder[]> => {
      await delay(500);
      return MOCK_SELL_QUEUE;
    }
  },
  transparency: {
    getData: async () => {
      await delay(800);
      return {
        circulatingSupply: 450000000,
        totalSupply: 1000000000,
        holders: 14205,
        distribution: [
           { name: 'Comunidade', value: 40, color: '#3b82f6' },
           { name: 'Reservas', value: 30, color: '#10b981' },
           { name: 'Equipe', value: 20, color: '#f59e0b' },
           { name: 'Marketing', value: 10, color: '#8b5cf6' },
        ]
      };
    }
  }
};
