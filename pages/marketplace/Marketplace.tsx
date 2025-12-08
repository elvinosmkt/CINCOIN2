
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

const Marketplace = () => {
  const { data: products, isLoading } = useQuery({ 
    queryKey: ['products'], 
    queryFn: api.marketplace.getProducts 
  });

  const buyMutation = useMutation({
    mutationFn: api.marketplace.buyProduct,
    onSuccess: () => {
      alert("Compra realizada com sucesso! (Demo)");
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loja</h2>
        <p className="text-muted-foreground">Use seus CNC para comprar produtos e serviços reais.</p>
      </div>

      {isLoading && <div className="text-center py-20">Carregando produtos...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product: Product) => {
          // Calculate prices based on BRL total and CNC percentage
          // Assuming 1 CNC = 0.50 BRL
          const cncRate = 0.50;
          const cncPrice = (product.totalPriceBRL * (product.cncPercentage / 100)) / cncRate;
          
          return (
            <Card key={product.id} className="overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">{product.category}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 border-t bg-muted/20 flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">{cncPrice.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} CNC</div>
                  <div className="text-xs text-muted-foreground">≈ R$ {product.totalPriceBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => {
                    if(window.confirm(`Comprar ${product.name} por ${cncPrice.toLocaleString('pt-BR')} CNC?`)) {
                      buyMutation.mutate(product.id);
                    }
                  }}
                  disabled={buyMutation.isPending}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Comprar
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;
