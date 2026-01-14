
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSellerProfile, useCompanyProducts } from '../../../hooks/useCinPlace';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { ArrowLeft, MapPin, Star, ShieldCheck, Store, Info } from 'lucide-react';

export const CinPlaceSellerPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  
  const { data: seller, isLoading: isLoadingSeller } = useSellerProfile(sellerId || '');
  const { data: products, isLoading: isLoadingProducts } = useCompanyProducts(sellerId || '');

  if (isLoadingSeller) return <div className="p-8 text-center animate-pulse">Carregando loja...</div>;
  if (!seller) return <div className="p-8 text-center">Loja não encontrada.</div>;

  return (
    <div className="space-y-6 pb-20">
       {/* Header with Navigation */}
       <div className="flex items-center gap-4">
           <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 h-auto rounded-full">
               <ArrowLeft className="h-5 w-5" />
           </Button>
           <h1 className="text-2xl font-bold">Vitrine da Loja</h1>
       </div>

       {/* Seller Info Card */}
       <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-card to-muted/20">
           <div className="relative h-32 bg-gradient-to-r from-primary/20 to-amber-600/20">
               <div className="absolute inset-0 bg-black/10"></div>
           </div>
           <CardContent className="relative pt-0 px-6 pb-6">
               <div className="flex flex-col md:flex-row gap-6 items-start">
                   {/* Logo */}
                   <div className="-mt-12 rounded-xl p-1 bg-background shadow-lg">
                       <img 
                          src={seller.imageUrl} 
                          alt={seller.name} 
                          className="h-24 w-24 rounded-lg object-cover border border-border" 
                        />
                   </div>
                   
                   {/* Info */}
                   <div className="flex-1 mt-2 space-y-2">
                       <div>
                           <div className="flex flex-col md:flex-row md:items-center gap-2">
                               <h2 className="text-2xl font-bold">{seller.name}</h2>
                               <div className="flex items-center gap-2">
                                   <span className="flex items-center text-xs font-bold bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-500/20">
                                       <Star className="h-3 w-3 fill-current mr-1"/> {seller.rating.toFixed(1)}
                                   </span>
                                   <span className="flex items-center text-xs font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full border border-green-500/20">
                                       <ShieldCheck className="h-3 w-3 mr-1"/> Verificado
                                   </span>
                               </div>
                           </div>
                           <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                               <MapPin className="h-3 w-3" /> {seller.address} - {seller.city}/{seller.state}
                           </p>
                       </div>
                       
                       <div className="bg-muted/40 p-3 rounded-lg text-sm leading-relaxed border border-border/50">
                           <div className="flex items-center gap-2 mb-1 text-primary font-semibold text-xs uppercase">
                               <Info className="h-3 w-3" /> Sobre a Loja
                           </div>
                           {seller.description}
                       </div>
                   </div>
               </div>
           </CardContent>
       </Card>

       {/* Products Grid */}
       <div className="space-y-4">
           <div className="flex items-center gap-2 pb-2 border-b border-border/50">
               <Store className="h-5 w-5 text-primary" />
               <h3 className="text-lg font-bold">Todos os Produtos ({products?.length || 0})</h3>
           </div>
           
           {isLoadingProducts ? (
               <div className="text-center py-10 text-muted-foreground">Carregando produtos...</div>
           ) : (
               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                   {products?.length === 0 && (
                       <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                           Esta loja ainda não cadastrou produtos.
                       </div>
                   )}
                   {products?.map(p => (
                       <ProductCard key={p.id} product={p} />
                   ))}
               </div>
           )}
       </div>
    </div>
  );
};
