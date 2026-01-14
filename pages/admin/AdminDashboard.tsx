
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Users, AlertTriangle, Activity, DollarSign, FileText, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: api.admin.getStats });
    const { data: recentUsers } = useQuery({ queryKey: ['admin-users-preview'], queryFn: api.admin.getUsers });
    const { data: pendingCompanies } = useQuery({ queryKey: ['admin-companies-preview'], queryFn: api.admin.getPendingCompanies });

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
            <p className="text-muted-foreground">Visão geral da operação da Cincoin Platform.</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
                         <p className="text-xs text-muted-foreground">+12 hoje</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fila de Validação</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.pendingValidations}</div>
                        <p className="text-xs text-muted-foreground">Empresas aguardando</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cotação Atual (PEG)</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats?.tokenPrice || 0, 'BRL')}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ordens de Venda</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.sellQueueSize}</div>
                        <p className="text-xs text-muted-foreground">Aguardando Liquidez</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Validações Pendentes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Validações de Parceiros</CardTitle>
                            <CardDescription>Documentos enviados recentemente.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/app/admin/companies')}>Ver Todos <ArrowRight className="ml-1 h-3 w-3"/></Button>
                    </CardHeader>
                    <CardContent>
                        {pendingCompanies?.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhuma solicitação pendente.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingCompanies?.slice(0, 3).map(company => (
                                    <div key={company.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                                                {company.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{company.name}</p>
                                                <p className="text-xs text-muted-foreground">{company.city}/{company.state}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-xs text-blue-600 cursor-pointer hover:underline mb-1">
                                                <FileText className="h-3 w-3" /> Ver Docs
                                            </div>
                                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Pendente</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Usuários Recentes */}
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Novos Usuários</CardTitle>
                            <CardDescription>Cadastros realizados na plataforma.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/app/admin/users')}>Ver Todos <ArrowRight className="ml-1 h-3 w-3"/></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers?.slice(0, 4).map(u => (
                                <div key={u.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{u.name}</p>
                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                                            ${u.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 
                                              u.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {u.kycStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="flex flex-col justify-center items-center text-center p-6 border-dashed">
                     <Activity className="h-10 w-10 text-muted-foreground mb-2" />
                     <h3 className="font-semibold">Volume de Transações</h3>
                     <p className="text-sm text-muted-foreground">Gráfico de volume diário será exibido aqui.</p>
                 </Card>
                 <Card className="flex flex-col justify-center items-center text-center p-6 border-dashed">
                     <Users className="h-10 w-10 text-muted-foreground mb-2" />
                     <h3 className="font-semibold">Crescimento da Comunidade</h3>
                     <p className="text-sm text-muted-foreground">Curva de adoção de novos usuários.</p>
                 </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
