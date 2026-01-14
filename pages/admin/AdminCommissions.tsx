
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Gift, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const AdminCommissions = () => {
    const { data: commissions, isLoading } = useQuery({ 
        queryKey: ['admin-commissions'], 
        queryFn: api.admin.getCommissions 
    });

    const totalPaid = commissions
        ?.filter(c => c.status === 'PAID')
        .reduce((acc, curr) => acc + curr.amount, 0) || 0;

    const totalPending = commissions
        ?.filter(c => c.status === 'PENDING')
        .reduce((acc, curr) => acc + curr.amount, 0) || 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Comissões & Indicações</h1>
                <p className="text-muted-foreground">Monitore os pagamentos de afiliados e bônus por indicação.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pago (CNC)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString('pt-BR')} CNC</div>
                        <p className="text-xs text-muted-foreground">Comissões já distribuídas</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendente (CNC)</CardTitle>
                        <Gift className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{totalPending.toLocaleString('pt-BR')} CNC</div>
                        <p className="text-xs text-muted-foreground">Aguardando validação de conta</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Indicações Totais</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{commissions?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Registros de vínculo</p>
                    </CardContent>
                </Card>
            </div>

            {/* Commissions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Transações</CardTitle>
                    <CardDescription>Detalhamento de quem indicou e a origem da comissão.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando dados...</div>
                    ) : (
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3">Data</th>
                                        <th className="px-4 py-3">Indicador (Padrinho)</th>
                                        <th className="px-4 py-3">Indicado / Comprador</th>
                                        <th className="px-4 py-3">Tipo</th>
                                        <th className="px-4 py-3 text-right">Valor Gerado</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commissions?.map((comm) => (
                                        <tr key={comm.id} className="border-b border-border/50 hover:bg-muted/20">
                                            <td className="px-4 py-3 font-mono text-xs">{new Date(comm.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                                                        {comm.referrerName.charAt(0)}
                                                    </div>
                                                    {comm.referrerName}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                     <ArrowRight className="h-3 w-3" />
                                                     {comm.refereeName}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded border 
                                                    ${comm.type === 'SIGNUP_BONUS' ? 'bg-blue-500/10 text-blue-600 border-blue-200' : 'bg-purple-500/10 text-purple-600 border-purple-200'}`}>
                                                    {comm.type === 'SIGNUP_BONUS' ? 'Bônus Cadastro' : '% Compra'}
                                                </span>
                                                {comm.type === 'PURCHASE_COMMISSION' && (
                                                    <div className="text-[10px] text-muted-foreground mt-0.5">
                                                        {comm.percentage}% de {formatCurrency(comm.baseValue || 0, 'CNC')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold font-mono">
                                                +{comm.amount.toLocaleString('pt-BR')} CNC
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                                                    ${comm.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {comm.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminCommissions;
