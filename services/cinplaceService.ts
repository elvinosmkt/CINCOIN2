
import { CinPlaceProduct, CinPlaceNegotiation, CinPlaceOrder, SellerProfile } from '../types/cinplace';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- MOCK SELLERS ---
const SELLERS: SellerProfile[] = [
  {
    id: 'c_1',
    name: 'TechStore Premium',
    description: 'Somos referência em produtos Apple e eletrônicos de alta performance no litoral catarinense. Oferecemos garantia mundial e suporte especializado.',
    address: 'Av. Brasil, 500 - Centro',
    city: 'Balneário Camboriú',
    state: 'SC',
    imageUrl: 'https://images.unsplash.com/photo-1531297461136-82lw8a2d2?auto=format&fit=crop&q=80&w=400',
    latitude: -26.9890,
    longitude: -48.6360,
    rating: 4.8,
    joinedAt: '2023-01-15'
  },
  {
    id: 'c_2',
    name: 'Agência Grow',
    description: 'A Agência Grow é especializada em serviços de informática, marketing digital e desenvolvimento web na cidade de Balneário Camboriú. Com serviços de consultoria estratégica, tráfego pago e branding.',
    address: 'Rua 1500, Sala 402 - Centro',
    city: 'Balneário Camboriú',
    state: 'SC',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
    latitude: -26.9920,
    longitude: -48.6340,
    rating: 5.0,
    joinedAt: '2023-03-10'
  },
  {
    id: 'c_4',
    name: 'Café do Vale',
    description: 'Cafés especiais selecionados diretamente do produtor.',
    address: 'Rua 3300, 45',
    city: 'Balneário Camboriú',
    state: 'SC',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
    latitude: -27.0010,
    longitude: -48.6250,
    rating: 4.5,
    joinedAt: '2023-06-20'
  }
];

// --- MOCK PRODUCTS ---
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
    name: 'Consultoria de Marketing (Pacote)',
    description: 'Pacote de 10 horas de consultoria estratégica para seu negócio alavancar vendas online.',
    priceFiat: 5000,
    discountPercent: 10, // 10% de desconto
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
    id: 'p_2_b',
    name: 'Manutenção de Computadores',
    description: 'Formatação, limpeza e upgrade de hardware. Serviço realizado em laboratório próprio.',
    priceFiat: 350,
    discountPercent: 5,
    imageUrl: 'https://images.unsplash.com/photo-1597872250977-13c9593c961e?auto=format&fit=crop&q=80&w=1000',
    category: 'Serviços',
    sellerId: 'c_2',
    sellerName: 'Agência Grow',
    acceptType: 'FIXED',
    fixedCinPercent: 100,
    allowNegotiation: false,
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
  // --- SELLERS ---
  getAllSellers: async (): Promise<SellerProfile[]> => {
    await delay(600);
    return SELLERS;
  },

  getSellerProfile: async (sellerId: string): Promise<SellerProfile | undefined> => {
    await delay(500);
    // Tenta buscar nos mocks, ou retorna um genérico baseado no ID se não existir
    const seller = SELLERS.find(s => s.id === sellerId);
    if (seller) return seller;
    
    // Fallback generico para IDs desconhecidos (ex: user logado criando empresa agora)
    return {
        id: sellerId,
        name: 'Vendedor Parceiro',
        description: 'Empresa parceira verificada Cincoin.',
        address: 'Endereço não informado',
        city: 'Cidade',
        state: 'UF',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400',
        latitude: -23.5505,
        longitude: -46.6333,
        rating: 4.0,
        joinedAt: new Date().toISOString()
    };
  },

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
    return PRODUCTS.filter(p => p.sellerId === companyId); 
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
