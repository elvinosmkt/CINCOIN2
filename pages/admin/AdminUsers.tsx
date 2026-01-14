
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, Search, MoreHorizontal, ShieldCheck, ShieldAlert, UserCheck } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../lib/utils';

const AdminUsers = () => {
    const { data: users, isLoading } = useQuery({ queryKey: ['admin-all-users'], queryFn: api.admin.getUsers });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
                    <p className="text-muted-foreground">Administre contas, saldos e status KYC.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Exportar CSV</Button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome, email ou ID..." className="pl-9" />
                </div>
                <select className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option>Todos Status</option>
                    <option>Verificado</option>
                    <option>Pendente</option>
                    <option>Bloqueado</option>
                </select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Base de Usuários</CardTitle>
                    <CardDescription>Total de {users?.length || 0} contas registradas.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando usuários...</div>
                    ) : (
                        <div className="space-y-4">
                            {users?.map((user) => (
                                <div key={user.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-muted/20 rounded-lg border hover:border-primary/30 transition-colors gap-4">
                                    <div className="flex items-center gap-4 flex-1 w-full">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold">{user.name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border
                                                    ${user.kycStatus === 'verified' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                      user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                                    {user.kycStatus === 'verified' ? 'Verificado' : user.kycStatus === 'pending' ? 'Pendente' : 'Não Verificado'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono mt-1">ID: {user.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase font-bold">Saldo Cripto</p>
                                            <p className="font-mono font-bold">{user.balance.toLocaleString('pt-BR')} CNC</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase font-bold">Saldo Fiat</p>
                                            <p className="font-mono font-bold text-green-600">{formatCurrency(user.fiatBalance, 'BRL')}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ver Detalhes">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUsers;
