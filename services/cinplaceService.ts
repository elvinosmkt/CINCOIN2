
import { CinPlaceProduct, CinPlaceNegotiation, CinPlaceOrder } from '../types/cinplace';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- MOCK DATA ---
let PRODUCTS: CinPlaceProduct[] = [
  {
    id: 'p_1',
    name: 'MacBook Pro M3',
    description: 'Notebook Apple de última geração, lacrado. Garantia de 1 ano Apple.',
    priceFiat: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000',
    category: 'Eletrônicos',
    sellerId: 'c_1',
    sellerName: 'TechStore Premium',
    acceptType: 'FIXED',
    fixedCinPercent: 30,
    allowNegotiation: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p_2',
    name: 'Consultoria de Marketing',
    description: 'Pacote de 10 horas de consultoria estratégica para seu negócio.',
    priceFiat: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000',
    category: 'Serviços',
    sellerId: 'c_2',
    sellerName: 'Agência Grow',
    acceptType: 'RANGE',
    minCinPercent: 20,
    maxCinPercent: 60,
    allowNegotiation: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p_3',
    name: 'Apartamento Balneário',
    description: 'Entrada facilitada com Cincoin. Vista para o mar.',
    priceFiat: 850000,
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
    category: 'Imóveis',
    sellerId: 'c_3',
    sellerName: 'Ocean Realty',
    acceptType: 'RANGE',
    minCinPercent: 10,
    maxCinPercent: 40,
    allowNegotiation: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p_4',
    name: 'Café Especial (1kg)',
    description: 'Grãos selecionados 100% Arábica.',
    priceFiat: 120,
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000',
    category: 'Alimentos',
    sellerId: 'c_4',
    sellerName: 'Café do Vale',
    acceptType: 'FIXED',
    fixedCinPercent: 100,
    allowNegotiation: false,
    createdAt: new Date().toISOString()
  }
];

let NEGOTIATIONS: CinPlaceNegotiation[] = [
    {
        id: 'n_1',
        productId: 'p_2',
        productName: 'Consultoria de Marketing',
        buyerId: 'u_123',
        buyerName: 'Alex Investidor',
        sellerId: 'c_2',
        requestedCinPercent: 70,
        status: 'PENDING',
        createdAt: new Date().toISOString()
    }
];

let ORDERS: CinPlaceOrder[] = [];

export const cinplaceService = {
  // --- PRODUCTS ---
  getProducts: async (): Promise<CinPlaceProduct[]> => {
    await delay(600);
    return PRODUCTS;
  },

  getProductById: async (id: string): Promise<CinPlaceProduct | undefined> => {
    await delay(400);
    return PRODUCTS.find(p => p.id === id);
  },

  getCompanyProducts: async (companyId: string): Promise<CinPlaceProduct[]> => {
    await delay(500);
    // Simulating that the logged user owns some products for demo purposes
    // In a real app, we filter by sellerId === companyId
    // For demo: return all if companyId matches or a subset
    return PRODUCTS; 
  },

  createProduct: async (product: Omit<CinPlaceProduct, 'id' | 'createdAt'>): Promise<CinPlaceProduct> => {
    await delay(1000);
    const newProduct: CinPlaceProduct = {
      ...product,
      id: `p_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    PRODUCTS.unshift(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<CinPlaceProduct>): Promise<CinPlaceProduct> => {
    await delay(800);
    const index = PRODUCTS.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    
    PRODUCTS[index] = { ...PRODUCTS[index], ...updates };
    return PRODUCTS[index];
  },

  // --- ORDERS ---
  createOrder: async (order: Omit<CinPlaceOrder, 'id' | 'createdAt'>): Promise<CinPlaceOrder> => {
    await delay(1500);
    const newOrder: CinPlaceOrder = {
        ...order,
        id: `o_${Date.now()}`,
        createdAt: new Date().toISOString()
    };
    ORDERS.push(newOrder);
    return newOrder;
  },

  // --- NEGOTIATIONS ---
  createNegotiation: async (input: Omit<CinPlaceNegotiation, 'id' | 'status' | 'createdAt'>): Promise<CinPlaceNegotiation> => {
    await delay(1000);
    const newNeg: CinPlaceNegotiation = {
        ...input,
        id: `n_${Date.now()}`,
        status: 'PENDING',
        createdAt: new Date().toISOString()
    };
    NEGOTIATIONS.unshift(newNeg);
    return newNeg;
  },

  getCompanyNegotiations: async (companyId: string): Promise<CinPlaceNegotiation[]> => {
      await delay(600);
      return NEGOTIATIONS;
  },

  updateNegotiationStatus: async (id: string, status: CinPlaceNegotiation['status']): Promise<void> => {
      await delay(800);
      const index = NEGOTIATIONS.findIndex(n => n.id === id);
      if(index !== -1) {
          NEGOTIATIONS[index].status = status;
      }
  }
};
