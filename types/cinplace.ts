
export type AcceptType = 'FIXED' | 'RANGE';
export type NegotiationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CinPlaceProduct {
  id: string;
  name: string;
  description: string;
  priceFiat: number; // Total price in BRL (Base price)
  discountPercent?: number; // Discount offered (e.g., 10%)
  imageUrl: string;
  category: string;
  sellerId: string;
  sellerName: string;
  
  // Rules for Cincoin acceptance
  acceptType: AcceptType;
  fixedCinPercent?: number; // Used if acceptType === 'FIXED'
  minCinPercent?: number;   // Used if acceptType === 'RANGE'
  maxCinPercent?: number;   // Used if acceptType === 'RANGE'
  
  allowNegotiation: boolean;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  rating: number;
  joinedAt: string;
}

export interface CinPlaceNegotiation {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  requestedCinPercent: number;
  status: NegotiationStatus;
  createdAt: string;
}

export interface CinPlaceOrder {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  totalPrice: number;
  chosenCinPercent: number;
  cinAmount: number;
  fiatAmount: number;
  createdAt: string;
}

export const CATEGORIES = ["Alimentos", "Eletrônicos", "Serviços", "Imóveis", "Veículos", "Outros"];
