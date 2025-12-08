
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCinPlaceProduct, useCreateOrder, useCreateNegotiation } from '../../../hooks/useCinPlace';
import { ProductSplitSelector } from '../components/ProductSplitSelector';
import { useAuthStore } from '../../../store/useStore';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { CincoinBadge } from '../../../components/ui/CincoinBadge';

export const CinPlaceProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: product, isLoading } = useCinPlaceProduct(id || '');
  const createOrder = useCreateOrder();
  const createNegotiation = useCreateNegotiation();

  const [splitState, setSplitState] = useState({ percent: 0, cinAmount: 0, fiatAmount: 0 });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [negotiationPercent, setNegotiationPercent] = useState('');

  if (isLoading) return <div className="p-8 text-center">Carregando detalhes...</div>;
  if (!product) return <div className="p-8 text-center">Produto não encontrado.</div>;

  const handleOrder = () => {
    if (!user) return alert("Faça login");
    if (splitState.cinAmount > user.balance) return alert("Saldo insuficiente");

    createOrder.mutate({
        productId: product.id,
        buyerId: user.id,
        sellerId: product.sellerId,
        totalPrice: product.priceFiat,
        chosenCinPercent: splitState.percent,
        cinAmount: splitState.cinAmount,
        fiatAmount: splitState.fiatAmount
    }, {
        onSuccess: () => {
            alert(`Compra de ${product.name} realizada com sucesso!`);
            setIsOrderModalOpen(false);
            navigate('/app/cinplace');
        }
    });
  };

  const handleNegotiation = () => {
      if (!user) return;
      const percent = Number(negotiationPercent);
      if (isNaN(percent) || percent < 0 || percent > 100) return alert("Percentual inválido");

      createNegotiation.mutate({
          productId: product.id,
          productName: product.name,
          buyerId: user.id,
          buyerName: user.name,
          sellerId: product.sellerId,
          requestedCinPercent: percent
      }, {
          onSuccess: () => {
              alert("Proposta enviada ao vendedor!");
              setIsNegotiationOpen(false);
          }
      });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <Button variant="ghost" onClick={() => navigate('/app/cinplace')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Loja
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Left: Image & Info */}
         <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
               <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            
            <Card>
               <CardContent className="p-6 space-y-4">
                   <h3 className="font-semibold text-lg">Descrição</h3>
                   <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                   
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShieldCheck className="h-5 w-5 text-green-500" /> Vendedor Verificado
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Truck className="h-5 w-5 text-blue-500" /> Entrega em todo Brasil
                      </div>
                   </div>
               </CardContent>
            </Card>
         </div>

         {/* Right: Checkout & Split */}
         <div className="space-y-6">
             <div>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-primary font-bold tracking-widest uppercase">{product.category}</span>
                    <CincoinBadge percentage={product.acceptType === 'FIXED' ? product.fixedCinPercent! : product.maxCinPercent!} />
                </div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-sm text-muted-foreground">Vendido por <span className="font-semibold text-foreground">{product.sellerName}</span></p>
                <div className="text-4xl font-bold mt-4">{formatCurrency(product.priceFiat, 'BRL')}</div>
             </div>

             <ProductSplitSelector 
                priceFiat={product.priceFiat}
                acceptType={product.acceptType}
                fixedCinPercent={product.fixedCinPercent}
                minCinPercent={product.minCinPercent}
                maxCinPercent={product.maxCinPercent}
                userBalance={user?.balance || 0}
                onSplitChange={(percent, cin, fiat) => setSplitState({ percent, cinAmount: cin, fiatAmount: fiat })}
             />

             <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full text-lg font-bold h-14" onClick={() => setIsOrderModalOpen(true)}>
                    Comprar Agora
                </Button>
                
                {product.allowNegotiation && (
                    <Button variant="outline" className="w-full" onClick={() => setIsNegotiationOpen(!isNegotiationOpen)}>
                        <MessageSquare className="h-4 w-4 mr-2" /> Negociar Percentual
                    </Button>
                )}
             </div>

             {/* Negotiation Form */}
             {isNegotiationOpen && (
                 <Card className="animate-in slide-in-from-top-2">
                     <CardContent className="p-4 space-y-3">
                         <h4 className="font-semibold text-sm">Propor novo split</h4>
                         <p className="text-xs text-muted-foreground">O vendedor analisará sua proposta.</p>
                         <div className="flex gap-2">
                            <Input 
                                placeholder="% Cincoin desejado" 
                                type="number" 
                                min="0" max="100" 
                                value={negotiationPercent}
                                onChange={(e) => setNegotiationPercent(e.target.value)}
                            />
                            <Button onClick={handleNegotiation}>Enviar</Button>
                         </div>
                     </CardContent>
                 </Card>
             )}
         </div>
      </div>

      {/* Confirmation Modal Mockup (Conditional Render) */}
      {isOrderModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <Card className="w-full max-w-md animate-in zoom-in-95">
                 <CardContent className="p-6 space-y-6">
                     <div className="text-center">
                         <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                         <h2 className="text-2xl font-bold">Confirmar Compra?</h2>
                         <p className="text-muted-foreground">{product.name}</p>
                     </div>
                     
                     <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                         <div className="flex justify-between">
                             <span className="text-sm">Pagamento em Cincoin ({splitState.percent}%)</span>
                             <span className="font-bold">{splitState.cinAmount.toLocaleString('pt-BR')} CNC</span>
                         </div>
                         <div className="flex justify-between">
                             <span className="text-sm">Pagamento em BRL</span>
                             <span className="font-bold">{formatCurrency(splitState.fiatAmount, 'BRL')}</span>
                         </div>
                         <div className="flex justify-between border-t border-border pt-2 mt-2">
                             <span className="font-bold">Total</span>
                             <span className="font-bold">{formatCurrency(product.priceFiat, 'BRL')}</span>
                         </div>
                     </div>

                     <div className="flex gap-3">
                         <Button variant="outline" className="flex-1" onClick={() => setIsOrderModalOpen(false)}>Cancelar</Button>
                         <Button className="flex-1" onClick={handleOrder}>Confirmar</Button>
                     </div>
                 </CardContent>
             </Card>
         </div>
      )}
    </div>
  );
};
