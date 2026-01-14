
import { User, Transaction, Product, BankAsset, SellOrder, Referral, Company, Commission, SystemFees } from '../types';
import { COMPANIES } from '../data/companies';

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
  pendingBonus: 250.00,
  kycStatus: 'unverified', // Default unverified to test logic, verify in Profile
};

const MOCK_ADMIN: User = {
  id: 'admin_001',
  name: 'Administrador Geral',
  email: 'admin@cincoin.asia',
  role: 'admin',
  balance: 100000000, // Supply Control Wallet
  fiatBalance: 0,
  pendingBonus: 0,
  kycStatus: 'verified'
};

const MOCK_ALL_USERS: User[] = [
    MOCK_USER,
    { id: 'u_2', name: 'Maria Silva', email: 'maria@email.com', role: 'user', balance: 5000, fiatBalance: 0, pendingBonus: 0, kycStatus: 'pending' },
    { id: 'u_3', name: 'João Souza', email: 'joao@email.com', role: 'user', balance: 1200, fiatBalance: 500, pendingBonus: 50, kycStatus: 'verified' },
    { id: 'u_4', name: 'Roberto Carlos', email: 'roberto@email.com', role: 'user', balance: 0, fiatBalance: 0, pendingBonus: 0, kycStatus: 'unverified' },
    { id: 'u_5', name: 'Empresa Teste', email: 'loja@empresa.com', role: 'company', balance: 50000, fiatBalance: 10000, pendingBonus: 0, kycStatus: 'verified' },
];

const MOCK_COMMISSIONS: Commission[] = [
    { id: 'c_1', referrerName: 'Alex Investidor', refereeName: 'João Souza', type: 'SIGNUP_BONUS', amount: 50, date: '2023-10-24', status: 'PAID' },
    { id: 'c_2', referrerName: 'Alex Investidor', refereeName: 'Maria Silva', type: 'PURCHASE_COMMISSION', amount: 15.50, baseValue: 310, percentage: 5, date: '2023-10-25', status: 'PAID' },
    { id: 'c_3', referrerName: 'Pedro Santos', refereeName: 'Lucas Lima', type: 'SIGNUP_BONUS', amount: 50, date: '2023-10-26', status: 'PENDING' },
    { id: 'c_4', referrerName: 'Maria Silva', refereeName: 'Ana Clara', type: 'PURCHASE_COMMISSION', amount: 120.00, baseValue: 2400, percentage: 5, date: '2023-10-26', status: 'PAID' },
];

// Mock Fees
let MOCK_FEES: SystemFees = {
    transferFeePercent: 1.5,
    withdrawalFeePercent: 2.0
};

// Pending Companies Mock
let PENDING_COMPANIES: Company[] = [
    {
        id: 'req_1',
        name: 'Padaria do João',
        category: 'Alimentos',
        address: 'Rua das Flores, 123',
        city: 'Itajaí',
        state: 'SC',
        phone: '(47) 9999-8888',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400',
        latitude: -26.90,
        longitude: -48.66,
        percentCincoin: 50,
        percentBRL: 50,
        rating: 0,
        totalReviews: 0,
        status: 'PENDING_VALIDATION',
        cnpj: '12.345.678/0001-90',
        cnpjCardUrl: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cnpj/comprovante-de-inscricao-e-de-situacao-cadastral/@@images/image', // Mock PDF/Image
        documentPhotoUrl: 'https://s2.glbimg.com/O7qNqS7i95r_Xg_JgQJgQJgQJg=/0x0:695x390/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/B/w/tNqNqS7i95r_Xg_JgQJg/rg-novo.jpg', // Mock ID
        ownerName: 'João Silva',
        requestDate: new Date().toISOString()
    }
];

// Token Price Mock (Stateful for session)
let TOKEN_PRICE = 0.50;

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

let MOCK_SELL_QUEUE: SellOrder[] = [
  { id: 'so_1', amount: 500, price: 0.50, totalBrl: 250, date: '2023-10-25', status: 'waiting', positionInQueue: 1 },
  { id: 'so_2', amount: 1000, price: 0.50, totalBrl: 500, date: '2023-10-20', status: 'processing', positionInQueue: 2 },
  { id: 'so_3', amount: 20000, price: 0.50, totalBrl: 10000, date: '2023-10-26', status: 'waiting', positionInQueue: 3 },
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
      
      // Admin Login Check
      if (email === 'admin@cincoin.asia' && password === '123456') {
          return MOCK_ADMIN;
      }

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
    updateProfile: async (data: Partial<User>): Promise<User> => {
       await delay(800);
       Object.assign(MOCK_USER, data);
       return MOCK_USER;
    },
    requestKyc: async (docs: any): Promise<void> => {
       await delay(1500);
       MOCK_USER.kycStatus = 'pending';
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
    getAdminPrice: async () => {
      await delay(200);
      return {
        price: TOKEN_PRICE, 
        currency: 'BRL',
        lastUpdate: new Date().toISOString()
      };
    },
    getFees: async (): Promise<SystemFees> => {
        await delay(300);
        return MOCK_FEES;
    },
    buyToken: async (amountCnc: number) => {
      await delay(1500);
      return { success: true };
    },
    sellToken: async (amountCnc: number) => {
      await delay(1500);
      // Ensure KYC in backend logic simulation
      if (MOCK_USER.kycStatus !== 'verified') {
          throw new Error("KYC required for selling tokens");
      }
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
  },
  // --- ADMIN API ---
  admin: {
    getStats: async () => {
        await delay(500);
        return {
            totalUsers: 14205,
            pendingValidations: PENDING_COMPANIES.length,
            volume24h: 2500000,
            tokenPrice: TOKEN_PRICE,
            sellQueueSize: MOCK_SELL_QUEUE.length
        }
    },
    getPendingCompanies: async (): Promise<Company[]> => {
        await delay(600);
        return PENDING_COMPANIES;
    },
    approveCompany: async (id: string) => {
        await delay(1000);
        PENDING_COMPANIES = PENDING_COMPANIES.filter(c => c.id !== id);
        return { success: true };
    },
    rejectCompany: async (id: string) => {
        await delay(800);
        PENDING_COMPANIES = PENDING_COMPANIES.filter(c => c.id !== id);
        return { success: true };
    },
    setTokenPrice: async (price: number) => {
        await delay(500);
        TOKEN_PRICE = price;
        return { success: true, newPrice: price };
    },
    updateFees: async (fees: SystemFees) => {
        await delay(500);
        MOCK_FEES = fees;
        return { success: true };
    },
    getUsers: async (): Promise<User[]> => {
        await delay(800);
        return MOCK_ALL_USERS;
    },
    processSellOrder: async (orderId: string) => {
        await delay(1000);
        MOCK_SELL_QUEUE = MOCK_SELL_QUEUE.filter(o => o.id !== orderId);
        return { success: true };
    },
    getCommissions: async (): Promise<Commission[]> => {
        await delay(700);
        return MOCK_COMMISSIONS;
    }
  }
};
