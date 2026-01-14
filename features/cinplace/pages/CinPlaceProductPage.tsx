
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCinPlaceProduct, useCreateOrder, useCreateNegotiation, useSellerProfile, useCompanyProducts } from '../../../hooks/useCinPlace';
import { ProductSplitSelector } from '../components/ProductSplitSelector';
import { useAuthStore } from '../../../store/useStore';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, MessageSquare, Scan, Store, Wallet, X, MapPin, Star, Tag, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { CincoinBadge } from '../../../components/ui/CincoinBadge';
import { ProductCard } from '../components/ProductCard';
import L from 'leaflet';

export const CinPlaceProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { data: product, isLoading } = useCinPlaceProduct(id || '');
  const { data: seller } = useSellerProfile(product?.sellerId || '');
  const { data: sellerProducts } = useCompanyProducts(product?.sellerId || '');

  const createOrder = useCreateOrder();
  const createNegotiation = useCreateNegotiation();

  const [splitState, setSplitState] = useState({ percent: 0, cinAmount: 0, fiatAmount: 0 });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [negotiationPercent, setNegotiationPercent] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const mapRef = useRef<L.Map | null>(null);

  // Initialize mini map when seller data is available
  useEffect(() => {
    if (seller && !mapRef.current) {
        const container = document.getElementById('mini-map');
        if (container) {
            const map = L.map('mini-map', {
                center: [seller.latitude, seller.longitude],
                zoom: 15,
                zoomControl: false,
                dragging: false,
                scrollWheelZoom: false
            });
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            
            const icon = L.divIcon({
                className: 'bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold',
                html: 'C',
                iconSize: [24, 24]
            });

            L.marker([seller.latitude, seller.longitude], { icon }).addTo(map);
            mapRef.current = map;
        }
    }
    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    }
  }, [seller]);


  if (isLoading) return <div className="p-8 text-center animate-pulse">Carregando detalhes...</div>;
  if (!product) return <div className="p-8 text-center">Produto não encontrado.</div>;

  // Calculate final price with discount
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const finalPrice = hasDiscount 
    ? product.priceFiat * (1 - (product.discountPercent! / 100))
    : product.priceFiat;

  const handleScanAndPay = () => {
    if (!user) return alert("Faça login");
    if (splitState.cinAmount > user.balance) return alert("Saldo insuficiente");

    setIsScanning(true);

    setTimeout(() => {
        handleOrderExecution();
    }, 2500);
  };

  const handleOrderExecution = () => {
    createOrder.mutate({
        productId: product.id,
        buyerId: user!.id,
        sellerId: product.sellerId,
        totalPrice: finalPrice,
        chosenCinPercent: splitState.percent,
        cinAmount: splitState.cinAmount,
        fiatAmount: splitState.fiatAmount
    }, {
        onSuccess: () => {
            setIsScanning(false);
            setIsOrderModalOpen(false);
            alert(`Pagamento em Cripto enviado! Pague o restante de ${formatCurrency(splitState.fiatAmount, 'BRL')} no balcão.`);
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

  const otherProducts = sellerProducts?.filter(p => p.id !== product.id) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <Button variant="ghost" onClick={() => navigate('/app/cinplace')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Loja
      </Button>

      {/* 
         LAYOUT GRID OTIMIZADO 
         Mobile: Ordem 1 (Img) -> Ordem 2 (Ações) -> Ordem 3 (Vendedor)
         Desktop: Coluna 1 (Img + Vendedor), Coluna 2 (Ações)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
         {/* ITEM 1: Imagem do Produto */}
         <div className="order-1 md:col-start-1 md:row-start-1">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-md">
               <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
         </div>

         {/* ITEM 2: Ações, Split e Detalhes (Direita no Desktop, Meio no Mobile) */}
         <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-3 space-y-6">
             <div>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-primary font-bold tracking-widest uppercase">{product.category}</span>
                    <CincoinBadge percentage={product.acceptType === 'FIXED' ? product.fixedCinPercent! : product.maxCinPercent!} />
                </div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                
                {hasDiscount && (
                    <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm font-bold mb-2">
                        <Tag className="h-4 w-4" />
                        {product.discountPercent}% OFF aplicado
                    </div>
                )}

                <div className="flex items-end gap-3 mt-4">
                    {hasDiscount && (
                        <span className="text-lg text-muted-foreground line-through mb-1">
                            {formatCurrency(product.priceFiat, 'BRL')}
                        </span>
                    )}
                    <div className="text-4xl font-bold">{formatCurrency(finalPrice, 'BRL')}</div>
                </div>
             </div>

             <div className="bg-card p-4 rounded-xl border border-border/60 text-sm space-y-2">
                 <div className="flex items-center gap-2 text-muted-foreground">
                     <ShieldCheck className="h-4 w-4 text-green-500" />
                     <span>Compra Garantida com Vendedor Verificado</span>
                 </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                     <Store className="h-4 w-4 text-amber-500" />
                     <span>Disponível para retirada imediata na loja</span>
                 </div>
             </div>

             <ProductSplitSelector 
                priceFiat={finalPrice} // Pass discounted price
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

             {/* Disclaimer Section */}
             <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-xs text-muted-foreground space-y-2">
                 <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p>
                        <strong>Termo de Responsabilidade:</strong> A Cincoin atua exclusivamente como intermediadora tecnológica de pagamentos. A entrega, qualidade e garantia deste produto são de inteira responsabilidade do vendedor <strong>{seller?.name}</strong>.
                    </p>
                 </div>
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

         {/* ITEM 3: Informações do Vendedor (Fim no Mobile, Esquerda Baixo no Desktop) */}
         <div className="order-3 md:col-start-1 md:row-start-2">
            {seller && (
                <Card className="overflow-hidden border-border/60">
                    <div className="bg-muted/30 p-4 border-b border-border/40">
                        <div className="flex items-center gap-3">
                            <img src={seller.imageUrl} alt={seller.name} className="h-12 w-12 rounded-full object-cover border border-border" />
                            <div>
                                <h3 className="font-bold text-lg">{seller.name}</h3>
                                <div className="flex items-center text-xs text-muted-foreground gap-2">
                                    <span className="flex items-center text-yellow-500"><Star className="h-3 w-3 fill-current mr-1"/> {seller.rating}</span>
                                    <span>• No CinPlace desde {new Date(seller.joinedAt).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-4 space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Sobre a Loja</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {seller.description}
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                             <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                <span>{seller.address} - {seller.city}/{seller.state}</span>
                             </div>
                             
                             {/* Mini Map Container */}
                             <div id="mini-map" className="w-full h-32 bg-muted rounded-lg border border-border/50 relative z-0"></div>
                        </div>
                        
                        <Button variant="outline" className="w-full" onClick={() => navigate(`/app/cinplace/seller/${seller.id}`)}>
                            Ver todos os itens desta loja
                        </Button>
                    </CardContent>
                </Card>
            )}
         </div>
      </div>
      
      {/* More items from seller */}
      {otherProducts.length > 0 && (
          <div className="pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-6">Mais itens de {seller?.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {otherProducts.slice(0, 4).map(p => (
                      <ProductCard key={p.id} product={p} />
                  ))}
              </div>
          </div>
      )}

      {/* Confirmation & Payment Modal (Same as before) */}
      {isOrderModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <Card className="w-full max-w-md animate-in zoom-in-95 overflow-hidden relative">
                 {/* Close Button */}
                 {!isScanning && (
                    <button 
                        onClick={() => setIsOrderModalOpen(false)}
                        className="absolute top-4 right-4 z-20 p-2 hover:bg-muted rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </button>
                 )}

                 {isScanning ? (
                     // Interface do Scanner
                     <div className="relative aspect-[3/4] bg-black">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-30 grayscale"></div>
                         
                         {/* Overlay de Scanning */}
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                             <div className="w-64 h-64 border-2 border-white/60 rounded-3xl relative overflow-hidden">
                                 {/* Cantos */}
                                 <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                                 <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                                 
                                 {/* Laser de Scan */}
                                 <div className="absolute top-0 left-0 w-full h-1 bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                             </div>
                             
                             <div className="mt-8 text-center bg-black/60 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                                 <p className="text-white font-bold animate-pulse">Lendo carteira...</p>
                                 <p className="text-xs text-gray-300 mt-1">Aponte para o QR Code do balcão</p>
                             </div>
                             
                             <Button variant="ghost" className="mt-4 text-white hover:text-red-400" onClick={() => setIsScanning(false)}>
                                 Cancelar
                             </Button>
                         </div>
                     </div>
                 ) : (
                     // Resumo do Pagamento
                     <CardContent className="p-6 space-y-6">
                         <div className="text-center">
                             <Store className="h-12 w-12 text-primary mx-auto mb-3" />
                             <h2 className="text-xl font-bold">Pagamento Híbrido</h2>
                             <p className="text-muted-foreground text-sm">Siga as etapas para concluir</p>
                         </div>
                         
                         <div className="space-y-4">
                             {/* Parte 1: Cripto */}
                             <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl space-y-2">
                                 <div className="flex justify-between items-center">
                                     <span className="text-xs font-bold text-primary uppercase tracking-wider">Parte 1: App</span>
                                     <Wallet className="h-4 w-4 text-primary" />
                                 </div>
                                 <div className="flex justify-between items-end">
                                     <span className="text-sm text-muted-foreground">Transferir via Cincoin</span>
                                     <span className="text-xl font-bold text-foreground">{splitState.cinAmount.toLocaleString('pt-BR')} CNC</span>
                                 </div>
                                 <p className="text-[10px] text-muted-foreground">Necessário escanear o QR Code da loja.</p>
                             </div>

                             {/* Divisor */}
                             <div className="relative flex items-center py-1">
                                 <div className="flex-grow border-t border-border"></div>
                                 <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground">+</span>
                                 <div className="flex-grow border-t border-border"></div>
                             </div>

                             {/* Parte 2: Fiat */}
                             <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl space-y-2">
                                 <div className="flex justify-between items-center">
                                     <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Parte 2: Loja</span>
                                     <Store className="h-4 w-4 text-blue-500" />
                                 </div>
                                 <div className="flex justify-between items-end">
                                     <span className="text-sm text-muted-foreground">Pagar no Caixa</span>
                                     <span className="text-xl font-bold text-foreground">{formatCurrency(splitState.fiatAmount, 'BRL')}</span>
                                 </div>
                                 <p className="text-[10px] text-muted-foreground">Dinheiro, Pix ou Cartão direto ao vendedor.</p>
                             </div>
                         </div>

                         <div className="pt-2">
                             <Button 
                                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" 
                                onClick={handleScanAndPay}
                             >
                                 <Scan className="mr-2 h-5 w-5" /> Escanear QR Code
                             </Button>
                             <p className="text-center text-xs text-muted-foreground mt-3">
                                 Ao escanear, você transfere os CNC imediatamente.
                             </p>
                         </div>
                     </CardContent>
                 )}
             </Card>
         </div>
      )}
    </div>
  );
};
