import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const Transparency = () => {
  const { data } = useQuery({ queryKey: ['transparency'], queryFn: api.transparency.getData });

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Transparência</h2>
        <p className="text-muted-foreground">Verificação de supply e tokenomics em tempo real.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 text-center">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Circulating Supply</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.circulatingSupply.toLocaleString('pt-BR')} CNC</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Supply</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.totalSupply.toLocaleString('pt-BR')} CNC</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Holders</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.holders.toLocaleString('pt-BR')}</div></CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Token</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {data?.distribution && (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={data.distribution}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={100}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {data.distribution.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                     ))}
                   </Pie>
                   <RechartsTooltip />
                   <Legend verticalAlign="bottom" height={36}/>
                 </PieChart>
               </ResponsiveContainer>
             )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>Progresso do Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-muted ml-4 space-y-8 py-2">
               {[
                 { title: 'Fase 1: Conceito & Whitepaper', status: 'completed', date: 'T1 2023' },
                 { title: 'Fase 2: Venda Pública & Listagem', status: 'completed', date: 'T3 2023' },
                 { title: 'Fase 3: Lançamento do Marketplace', status: 'active', date: 'T4 2023' },
                 { title: 'Fase 4: Parcerias Globais', status: 'pending', date: '2024' },
               ].map((item, i) => (
                 <div key={i} className="pl-6 relative">
                    <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 
                      ${item.status === 'completed' ? 'bg-primary border-primary' : item.status === 'active' ? 'bg-background border-primary animate-pulse' : 'bg-background border-muted'}`} 
                    />
                    <h4 className={`text-sm font-semibold ${item.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>{item.title}</h4>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transparency;