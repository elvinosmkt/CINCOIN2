
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../lib/utils';
import { DollarSign, Save, ArrowRightLeft, CheckCircle2, Clock, Percent } from 'lucide-react';
import { SellOrder } from '../../types';

const AdminExchange = () => {
    const queryClient = useQueryClient();
    const { data: priceData } = useQuery({ queryKey: ['adminPrice'], queryFn: api.exchange.getAdminPrice });
    const { data: queue } = useQuery({ queryKey: ['sellQueue'], queryFn: api.exchange.getSellQueue });
    const { data: fees } = useQuery({ queryKey: ['fees'], queryFn: api.exchange.getFees });
    
    const [newPrice, setNewPrice] = useState('');
    const [transferFee, setTransferFee] = useState('');
    const [withdrawalFee, setWithdrawalFee] = useState('');

    useEffect(() => {
        if (fees) {
            setTransferFee(String(fees.transferFeePercent));
            setWithdrawalFee(String(fees.withdrawalFeePercent));
        }
    }, [fees]);

    const updatePriceMutation = useMutation({
        mutationFn: api.admin.setTokenPrice,
        onSuccess: () => {
            alert("Preço do token atualizado em toda a plataforma!");
            queryClient.invalidateQueries({ queryKey: ['adminPrice'] });
            setNewPrice('');
        }
    });

    const updateFeesMutation = useMutation({
        mutationFn: api.admin.updateFees,
        onSuccess: () => {
            alert("Taxas do sistema atualizadas!");
            queryClient.invalidateQueries({ queryKey: ['fees'] });
        }
    });

    const approveSellMutation = useMutation({
        mutationFn: api.admin.processSellOrder,
        onSuccess: () => {
            alert("Ordem processada! O pagamento (Split) foi liberado para o usuário.");
            queryClient.invalidateQueries({ queryKey: ['sellQueue'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
    });

    const handleUpdatePrice = () => {
        const price = Number(newPrice);
        if (price > 0) {
            updatePriceMutation.mutate(price);
        }
    };

    const handleUpdateFees = () => {
        updateFeesMutation.mutate({
            transferFeePercent: Number(transferFee),
            withdrawalFeePercent: Number(withdrawalFee)
        });
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Gestão da Exchange</h1>
                    <p className="text-muted-foreground">Controle de liquidez, taxas e precificação do ativo.</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    {/* Controle de Preço */}
                    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" /> Definir Preço Oficial (Peg)
                            </CardTitle>
                            <CardDescription>
                                Este valor será replicado para o CinPlace, CinBank e Wallet de todos os usuários.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center py-4 bg-background rounded-lg border border-border shadow-inner">
                                <p className="text-sm text-muted-foreground">Preço Atual</p>
                                <p className="text-4xl font-bold text-primary">{formatCurrency(priceData?.price || 0, 'BRL')}</p>
                                <p className="text-xs text-muted-foreground mt-1">Última atualização: Hoje</p>
                            </div>
                            
                            <div className="flex gap-2 items-end pt-2">
                                <div className="flex-1 space-y-1">
                                    <label className="text-sm font-medium">Novo Preço (BRL)</label>
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleUpdatePrice} disabled={updatePriceMutation.isPending}>
                                    <Save className="h-4 w-4 mr-2" /> Salvar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configuração de Taxas */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Percent className="h-5 w-5 text-muted-foreground" /> Configuração de Taxas
                            </CardTitle>
                            <CardDescription>
                                Defina a porcentagem cobrada sobre transações e saques.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Transferência (%)</label>
                                    <Input 
                                        type="number"
                                        step="0.1"
                                        value={transferFee}
                                        onChange={(e) => setTransferFee(e.target.value)}
                                        placeholder="1.5"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Cobrado em envios P2P</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Saque/Venda (%)</label>
                                    <Input 
                                        type="number"
                                        step="0.1"
                                        value={withdrawalFee}
                                        onChange={(e) => setWithdrawalFee(e.target.value)}
                                        placeholder="2.0"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Cobrado ao sacar BRL</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" onClick={handleUpdateFees} disabled={updateFeesMutation.isPending}>
                                <Save className="h-4 w-4 mr-2" /> Atualizar Taxas
                            </Button>
                        </CardContent>
                    </Card>
                 </div>

                 {/* Fila de Vendas */}
                 <Card className="border-blue-500/20 shadow-lg">
                     <CardHeader className="bg-muted/20">
                         <CardTitle className="flex items-center gap-2">
                             <ArrowRightLeft className="h-5 w-5 text-blue-500" /> Ordens de Venda
                         </CardTitle>
                         <CardDescription>Aprovar vendas para Split de Pagamento.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-0">
                         <div className="max-h-[500px] overflow-y-auto">
                             {queue?.length === 0 ? (
                                 <div className="p-8 text-center text-muted-foreground">
                                     <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                     <p>Nenhuma ordem na fila.</p>
                                 </div>
                             ) : (
                                 <div className="divide-y divide-border">
                                     {queue?.map((order, idx) => (
                                         <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors flex flex-col sm:flex-row justify-between items-center gap-4">
                                             <div className="flex items-center gap-4 w-full sm:w-auto">
                                                 <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                                                     #{order.positionInQueue}
                                                 </div>
                                                 <div>
                                                     <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{order.amount.toLocaleString()} CNC</span>
                                                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{order.id}</span>
                                                     </div>
                                                     <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                         <Clock className="h-3 w-3" /> {new Date(order.date).toLocaleDateString()}
                                                     </p>
                                                 </div>
                                             </div>
                                             
                                             <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                 <div className="text-right mr-2">
                                                     <p className="text-xs text-muted-foreground uppercase font-bold">Valor a Pagar</p>
                                                     <p className="font-mono font-bold text-green-600 text-lg">{formatCurrency(order.totalBrl, 'BRL')}</p>
                                                 </div>
                                                 
                                                 {order.status === 'waiting' || order.status === 'processing' ? (
                                                     <Button 
                                                         size="sm" 
                                                         className="bg-green-600 hover:bg-green-700 shadow-md"
                                                         onClick={() => {
                                                             if(window.confirm(`Confirmar pagamento de ${formatCurrency(order.totalBrl, 'BRL')} para o usuário?`)) {
                                                                 approveSellMutation.mutate(order.id);
                                                             }
                                                         }}
                                                         isLoading={approveSellMutation.isPending}
                                                     >
                                                         Pagar & Finalizar
                                                     </Button>
                                                 ) : (
                                                     <Button size="sm" variant="outline" disabled className="text-green-600 border-green-200 bg-green-50">
                                                         <CheckCircle2 className="h-4 w-4 mr-1" /> Concluído
                                                     </Button>
                                                 )}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>
                     </CardContent>
                 </Card>
             </div>
        </div>
    );
};

export default AdminExchange;
