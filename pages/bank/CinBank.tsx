
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Landmark, CreditCard, TrendingUp, PiggyBank, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BankAsset } from '../../types';

const CinBank = () => {
  const { data: assets } = useQuery({ queryKey: ['bankAssets'], queryFn: api.bank.getAssets });

  return (
    <div className="space-y-8">
      {/* Header CinBank */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
               <Landmark className="h-8 w-8 text-green-500" />
               CinBank <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-md ml-2">Digital</span>
            </h2>
            <p className="text-muted-foreground mt-1">Serviços financeiros integrados ao seu portfólio cripto.</p>
         </div>
         <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
            Novo Aporte
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Coluna 1: Cartão e Resumo */}
         <div className="lg:col-span-1 space-y-6">
            {/* Cartão de Crédito Visual */}
            <div className="relative h-56 w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6 text-white shadow-2xl border border-white/10 overflow-hidden group">
               <div className="absolute top-0 right-0 p-32 bg-green-500/20 blur-[80px] rounded-full group-hover:bg-green-500/30 transition-all"></div>
               <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-center">
                     <span className="font-bold italic text-lg tracking-widest">CINBANK</span>
                     <CreditCard className="h-6 w-6 opacity-80" />
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="h-8 w-10 bg-yellow-500/80 rounded-md"></div>
                     <ShieldCheck className="h-5 w-5 opacity-50" />
                  </div>
                  <div className="space-y-1">
                     <p className="font-mono text-lg tracking-wider opacity-90">•••• •••• •••• 4289</p>
                     <div className="flex justify-between items-end">
                        <span className="text-xs opacity-70">Alex Investidor</span>
                        <span className="text-xs opacity-70">VALID 12/28</span>
                     </div>
                  </div>
               </div>
            </div>

            <Card>
               <CardHeader>
                  <CardTitle className="text-sm font-medium">Limite Disponível</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-green-500">R$ 12.500,00</div>
                  <div className="mt-4 flex gap-2">
                     <Button size="sm" variant="outline" className="flex-1">Ajustar Limite</Button>
                     <Button size="sm" variant="outline" className="flex-1">Fatura</Button>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Coluna 2 e 3: Investimentos */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-green-500" /> Meus Investimentos
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
               {/* Card CDI */}
               <Card className="border-green-500/20 bg-gradient-to-br from-card to-green-900/5">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-base font-medium">Renda Fixa (CDI)</CardTitle>
                     <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">R$ 5.000,00</div>
                     <p className="text-xs text-muted-foreground mt-1 mb-4">+ 110% do CDI</p>
                     <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">Investir Mais</Button>
                  </CardContent>
               </Card>

               {/* Card Consorcio */}
               <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-900/5">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-base font-medium">Consórcio Auto</CardTitle>
                     <PiggyBank className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">R$ 12.500,00</div>
                     <p className="text-xs text-muted-foreground mt-1 mb-4">Cota: 504 • Pago: 15%</p>
                     <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Ver Detalhes</Button>
                  </CardContent>
               </Card>
            </div>

            <Card>
               <CardHeader>
                  <CardTitle>Oportunidades Disponíveis</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="space-y-0 divide-y divide-border/50">
                     {[
                        { name: "LCI Banco ABC", rate: "98% CDI", min: "R$ 1.000", risk: "Baixo" },
                        { name: "Consórcio Imobiliário", rate: "Taxa Adm. 12%", min: "R$ 500/mês", risk: "N/A" },
                        { name: "Fundo Cincoin Tech", rate: "Var. Cambial + 5%", min: "500 CNC", risk: "Médio" },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                           <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">Mínimo: {item.min}</div>
                           </div>
                           <div className="text-right">
                              <div className="font-bold text-green-500">{item.rate}</div>
                              <div className="text-xs text-muted-foreground">Risco: {item.risk}</div>
                           </div>
                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full"><ArrowUpRight className="h-4 w-4" /></Button>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default CinBank;
