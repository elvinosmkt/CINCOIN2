
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cinplaceService } from '../services/cinplaceService';
import { CinPlaceProduct, CinPlaceNegotiation, CinPlaceOrder } from '../types/cinplace';

// --- PRODUCTS ---

export const useCinPlaceProducts = () => {
  return useQuery({
    queryKey: ['cinplace-products'],
    queryFn: cinplaceService.getProducts,
  });
};

export const useCinPlaceProduct = (id: string) => {
  return useQuery({
    queryKey: ['cinplace-product', id],
    queryFn: () => cinplaceService.getProductById(id),
    enabled: !!id,
  });
};

export const useAllSellers = () => {
  return useQuery({
    queryKey: ['all-sellers'],
    queryFn: cinplaceService.getAllSellers,
  });
};

export const useSellerProfile = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller-profile', sellerId],
    queryFn: () => cinplaceService.getSellerProfile(sellerId),
    enabled: !!sellerId,
  });
};

export const useCompanyProducts = (companyId: string) => {
  return useQuery({
    queryKey: ['company-products', companyId],
    queryFn: () => cinplaceService.getCompanyProducts(companyId),
    enabled: !!companyId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cinplaceService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cinplace-products'] });
      queryClient.invalidateQueries({ queryKey: ['company-products'] });
    },
  });
};

// --- ORDERS ---

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: cinplaceService.createOrder,
  });
};

// --- NEGOTIATIONS ---

export const useCompanyNegotiations = (companyId: string) => {
  return useQuery({
    queryKey: ['company-negotiations', companyId],
    queryFn: () => cinplaceService.getCompanyNegotiations(companyId),
    enabled: !!companyId,
  });
};

export const useCreateNegotiation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cinplaceService.createNegotiation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-negotiations'] });
    },
  });
};

export const useUpdateNegotiationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CinPlaceNegotiation['status'] }) => 
      cinplaceService.updateNegotiationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-negotiations'] });
    },
  });
};
