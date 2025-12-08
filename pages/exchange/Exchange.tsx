
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeftRight, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { SellOrder } from '../../types';

const Exchange = () => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  
  const { data: priceData, isLoading: isLoadingPrice } = useQuery({ 
    queryKey: ['adminPrice'], 
    queryFn: api.exchange.getAdminPrice 
  });

  const { data: sellQueue } = useQuery({
    queryKey: ['sellQueue'],
    queryFn: api.exchange.getSellQueue
  });

  const buyMutation = useMutation({
    mutationFn: api.exchange.buyToken,
    onSuccess: () => {
      alert("Compra realizada com sucesso!");
      setAmount('');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const sellMutation = useMutation({
    mutationFn: api.exchange.sellToken,
    onSuccess: () => {
      alert("Ordem de venda enviada para a fila de execução.");
      setAmount('');
      queryClient.invalidateQueries({ queryKey: ['sellQueue'] });
    }
  });

  const handleAction = () => {
    if (!amount || isNaN(Number(amount))) return;
    
    if (activeTab === 'buy') {
      buyMutation.mutate(Number(amount));
    } else {
      sellMutation.mutate(Number(amount));
    }
  };

  const adminPrice = priceData?.price || 0.50;
  const totalValue = Number(amount) * adminPrice;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Preço Fixo */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
         <div className="flex items-center gap-3">
             <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                 <ShieldCheck className="h-6 w-6 text-primary" />
             </div>
             <div>
                 <h2 className="text-lg font-bold">Cotação Oficial</h2>
                 <p className="text-xs text-muted-foreground">Estabelecida pela Plataforma</p>
             </div>
         </div>
         <div className="text-center md:text-right">
             <div className="text-3xl font-mono font-bold text-primary">
                 {isLoadingPrice ? '...' : formatCurrency(adminPrice, 'BRL')}
             </div>
             <p className="text-xs text-muted-foreground">1 CNC = R$ {adminPrice.toFixed(2)}</p>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         {/* Formulário de Operação */}
         <Card className="h-fit">
             <CardHeader>
                 <div className="flex bg-muted rounded-lg p-1 mb-4">
                     <button 
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'buy' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                        onClick={() => setActiveTab('buy')}
                     >
                         Comprar
                     </button>
                     <button 
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'sell' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                        onClick={() => setActiveTab('sell')}
                     >
                         Vender
                     </button>
                 </div>
                 <CardTitle>{activeTab === 'buy' ? 'Adquirir Cincoins' : 'Colocar à Venda'}</CardTitle>
                 <CardDescription>
                     {activeTab === 'buy' 
                        ? 'Compra imediata pelo valor fixado.' 
                        : 'Sua ordem entrará na fila de espera para execução.'}
                 </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                 <div className="space-y-2">
                     <label className="text-sm font-medium">Quantidade (CNC)</label>
                     <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg"
                     />
                 </div>

                 <div className="bg-muted/30 p-4 rounded-lg space-y-2 border border-border/50">
                     <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">Preço Unitário</span>
                         <span className="font-mono">{formatCurrency(adminPrice, 'BRL')}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">Taxa</span>
                         <span className="font-mono text-green-500">Grátis</span>
                     </div>
                     <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                         <span>Total {activeTab === 'buy' ? 'a Pagar' : 'a Receber'}</span>
                         <span>{formatCurrency(totalValue, 'BRL')}</span>
                     </div>
                 </div>

                 {activeTab === 'sell' && (
                     <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-500 text-xs">
                         <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                         <p>
                             Atenção: A venda não é imediata. Sua ordem entrará em uma lista de espera e será executada conforme a liquidez da plataforma.
                         </p>
                     </div>
                 )}

                 <Button 
                    className={`w-full h-12 text-lg font-bold ${activeTab === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    onClick={handleAction}
                    isLoading={buyMutation.isPending || sellMutation.isPending}
                 >
                     {activeTab === 'buy' ? 'Confirmar Compra' : 'Confirmar Venda'}
                 </Button>
             </CardContent>
         </Card>

         {/* Fila de Vendas (Visível apenas se houver ordens ou info relevante) */}
         <div className="space-y-6">
             <Card>
                 <CardHeader>
                     <CardTitle className="text-lg">Minhas Ordens de Venda</CardTitle>
                     <CardDescription>Acompanhe o status das suas ordens na fila.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     {sellQueue && sellQueue.length > 0 ? (
                         <div className="space-y-3">
                             {sellQueue.map((order: SellOrder) => (
                                 <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card/50">
                                     <div>
                                         <div className="font-bold">{order.amount} CNC</div>
                                         <div className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</div>
                                     </div>
                                     <div className="text-right">
                                         <div className="font-mono text-sm">{formatCurrency(order.totalBrl, 'BRL')}</div>
                                         <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1
                                             ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                               order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                             {order.status === 'waiting' ? `Fila: #${order.positionInQueue}` : 
                                              order.status === 'processing' ? 'Processando' : 'Concluído'}
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     ) : (
                         <div className="text-center py-10 text-muted-foreground">
                             <ArrowLeftRight className="h-10 w-10 mx-auto mb-3 opacity-20" />
                             <p>Você não tem ordens de venda ativas.</p>
                         </div>
                     )}
                 </CardContent>
             </Card>

             <Card className="bg-primary/5 border-primary/20">
                 <CardContent className="p-4 flex gap-4 items-start">
                     <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                     <div className="text-sm">
                         <h4 className="font-bold text-primary mb-1">Como funciona a fila?</h4>
                         <p className="text-muted-foreground">
                             Para garantir a estabilidade do token, todas as vendas passam por validação e execução sequencial. O preço é garantido no momento da ordem.
                         </p>
                     </div>
                 </CardContent>
             </Card>
         </div>
      </div>
    </div>
  );
};

export default Exchange;
