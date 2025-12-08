import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { formatCurrency } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, CreditCard, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../store/useStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Fetch user data
  const { data: userProfile } = useQuery({ queryKey: ['user'], queryFn: api.user.getProfile });
  const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: api.user.getTransactions });
  const { data: history } = useQuery({ queryKey: ['history'], queryFn: api.user.getBalanceHistory });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Painel</h2>
          <p className="text-muted-foreground">Bem-vindo de volta, {user?.name} 👋</p>
        </div>
        <div className="flex gap-2">
           <Button onClick={() => navigate('/app/wallet')}>
             <ArrowUpRight className="mr-2 h-4 w-4" /> Enviar
           </Button>
           <Button variant="secondary" onClick={() => navigate('/app/wallet')}>
             <ArrowDownLeft className="mr-2 h-4 w-4" /> Receber
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(userProfile?.balance || 0)}</div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor de Mercado (BRL)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~ R$ 7.710,25</div>
            <p className="text-xs text-muted-foreground">1 CNC = R$ 0,50 BRL</p>
          </CardContent>
        </Card>
        <Card>
           {/* Mock Action */}
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações Pendentes</CardTitle>
             <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">Tudo em dia!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Histórico de Saldo</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                   <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{fontSize: 12}} dy={10} />
                   <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                   />
                   <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {transactions?.map((tx) => (
                <div key={tx.id} className="flex items-center">
                  <div className={
                    `flex h-9 w-9 items-center justify-center rounded-full border border-border
                    ${tx.type === 'receive' || tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                    `
                  }>
                    {tx.type === 'receive' || tx.type === 'deposit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{tx.type} - {tx.counterparty}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className={`ml-auto font-medium ${tx.type === 'receive' || tx.type === 'deposit' ? 'text-green-500' : ''}`}>
                    {tx.type === 'receive' || tx.type === 'deposit' ? '+' : '-'}{tx.amount} CNC
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;