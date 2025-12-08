
import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useStore';
import { useCompanyProducts, useCreateProduct } from '../../../hooks/useCinPlace';
import { ProductForm } from '../components/ProductForm';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { PlusCircle, Edit } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

export const CinPlaceCompanyProductsPage = () => {
  const { user } = useAuthStore();
  // In a real app, user.id would be the companyId
  const { data: products, isLoading } = useCompanyProducts(user?.id || 'c_1');
  const createProduct = useCreateProduct();
  
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (data: any) => {
      createProduct.mutate({
          ...data,
          sellerId: user?.id || 'c_1',
          sellerName: user?.name || 'Minha Empresa'
      }, {
          onSuccess: () => {
              setIsCreating(false);
          }
      });
  };

  if (isCreating) {
      return (
          <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Novo Produto</h2>
              <Card>
                  <CardContent className="p-6">
                      <ProductForm 
                          onSubmit={handleSubmit} 
                          onCancel={() => setIsCreating(false)} 
                          isLoading={createProduct.isPending} 
                       />
                  </CardContent>
              </Card>
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
           <div>
               <h2 className="text-3xl font-bold">Meus Produtos</h2>
               <p className="text-muted-foreground">Gerencie seu catálogo e regras de Cincoin.</p>
           </div>
           <Button onClick={() => setIsCreating(true)}>
               <PlusCircle className="h-4 w-4 mr-2" /> Novo Produto
           </Button>
       </div>

       {isLoading ? <div>Carregando...</div> : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {products?.map(p => (
                   <Card key={p.id} className="relative group">
                       <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                           <img src={p.imageUrl} className="w-full h-full object-cover opacity-80" alt={p.name} />
                       </div>
                       <CardContent className="p-4 space-y-2">
                           <div className="flex justify-between">
                               <h3 className="font-bold line-clamp-1">{p.name}</h3>
                               <span className="text-xs bg-muted px-2 py-1 rounded">{p.category}</span>
                           </div>
                           <p className="text-sm text-muted-foreground">{formatCurrency(p.priceFiat, 'BRL')}</p>
                           <div className="text-xs font-semibold text-primary">
                               {p.acceptType === 'FIXED' ? `Fixo: ${p.fixedCinPercent}%` : `Range: ${p.minCinPercent}% - ${p.maxCinPercent}%`}
                           </div>
                           <Button variant="outline" size="sm" className="w-full mt-2" disabled>
                               <Edit className="h-3 w-3 mr-2" /> Editar (Demo)
                           </Button>
                       </CardContent>
                   </Card>
               ))}
           </div>
       )}
    </div>
  );
};
