
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QrCode, CreditCard, Users, FileText, Settings, Info, ShoppingCart, Copy, Share2, Scan, X } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'statement' | 'orders' | 'referrals' | 'settings' | 'about'>('statement');
  const [showScanner, setShowScanner] = useState(false);

  // Queries
  const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: api.user.getTransactions });
  const { data: sellQueue } = useQuery({ queryKey: ['sellQueue'], queryFn: api.exchange.getSellQueue });
  const { data: referrals } = useQuery({ queryKey: ['referrals'], queryFn: api.user.getReferrals });
  const { data: adminPrice } = useQuery({ queryKey: ['adminPrice'], queryFn: api.exchange.getAdminPrice });

  const currentPrice = adminPrice?.price || 0.50;
  const fiatValue = (user?.balance || 0) * currentPrice;

  const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all w-20 gap-1
        ${activeTab === id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
    >
      <div className={`p-2 rounded-full ${activeTab === id ? 'bg-primary text-white' : 'bg-muted'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      
      {/* 1. Header com Saldos */}
      <div className="space-y-4 text-center">
         <h2 className="text-xl font-semibold">Minha Carteira</h2>
         
         {/* Main Balance Card */}
         <div className="bg-gradient-to-br from-slate-900 to-black text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-white/10">
            {/* Background blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full -mr-10 -mt-10"></div>
            
            <div className="relative z-10 space-y-6">
               <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Saldo Disponível</p>
                  <h1 className="text-4xl font-bold">{user?.balance?.toLocaleString('pt-BR')} CNC</h1>
               </div>
               
               <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                      <p className="text-slate-400 text-[10px] uppercase">Valor Financeiro</p>
                      <p className="font-mono text-lg text-green-400">≈ {formatCurrency(fiatValue, 'BRL')}</p>
                  </div>
                  <div>
                      <p className="text-slate-400 text-[10px] uppercase">Bônus Pendente</p>
                      <p className="font-mono text-lg text-yellow-400">{user?.pendingBonus?.toLocaleString('pt-BR')} CNC</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Promo Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex justify-between items-center">
             <div className="flex-1">
                 <h3 className="font-bold text-lg leading-tight mb-1">Convide 10 Amigos</h3>
                 <p className="text-xs opacity-90 mb-2">E ganhe <span className="font-bold text-yellow-200">500 CNC</span> de bônus!</p>
                 <div className="text-[10px] bg-black/20 inline-block px-2 py-0.5 rounded-full">
                    Apenas contas validadas
                 </div>
             </div>
             <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                 <Users className="h-6 w-6" />
             </div>
         </div>
      </div>

      {/* 3. Main Actions */}
      <div className="grid grid-cols-3 gap-4">
          <Button 
            className="h-auto flex-col py-4 gap-2 bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/app/exchange')}
          >
              <ShoppingCart className="h-6 w-6" />
              <span>Adquirir</span>
          </Button>

          <Button 
            className="h-auto flex-col py-4 gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => setActiveTab('referrals')}
          >
              <Share2 className="h-6 w-6" />
              <span>Convidar</span>
          </Button>

          <Button 
            className="h-auto flex-col py-4 gap-2 bg-slate-700 hover:bg-slate-800"
            onClick={() => setShowScanner(true)}
          >
              <Scan className="h-6 w-6" />
              <span>Pagar</span>
          </Button>
      </div>

      {/* 4. Menu Tabs (Scrollable Row) */}
      <div className="flex justify-between overflow-x-auto pb-2 border-b border-border/50">
         <TabButton id="statement" icon={FileText} label="Extrato" />
         <TabButton id="orders" icon={CreditCard} label="Ordens" />
         <TabButton id="referrals" icon={Users} label="Convidados" />
         <TabButton id="settings" icon={Settings} label="Configurar" />
         <TabButton id="about" icon={Info} label="Sobre" />
      </div>

      {/* 5. Tab Content */}
      <div className="min-h-[200px]">
          {activeTab === 'statement' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Últimas Transações</h3>
                  {transactions?.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50">
                          <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.type === 'receive' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {tx.type === 'receive' ? '+' : '-'}
                              </div>
                              <div>
                                  <p className="font-medium text-sm">{tx.counterparty}</p>
                                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                              </div>
                          </div>
                          <span className={`font-bold ${tx.type === 'receive' ? 'text-green-500' : ''}`}>
                              {tx.type === 'receive' ? '+' : '-'}{tx.amount} CNC
                          </span>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'orders' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-muted-foreground">Ordens de Venda (Fila)</h3>
                    <Button variant="link" size="sm" className="h-auto p-0" onClick={() => navigate('/app/exchange')}>Nova Ordem</Button>
                  </div>
                  {sellQueue?.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-8">Nenhuma ordem ativa.</p>
                  ) : (
                      sellQueue?.map((order) => (
                          <div key={order.id} className="p-3 bg-card rounded-xl border border-border/50 flex justify-between items-center">
                              <div>
                                  <p className="font-bold">{order.amount} CNC</p>
                                  <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-xs font-mono bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded">
                                      Posição: #{order.positionInQueue}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">Status: {order.status}</p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          )}

          {activeTab === 'referrals' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                          <p className="text-sm font-medium mb-2">Seu Código de Convite</p>
                          <div className="flex items-center gap-2 bg-background p-2 rounded-lg border border-border w-full justify-center mb-2">
                              <span className="font-mono font-bold text-lg tracking-widest">ALEX2024</span>
                              <Copy className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => alert('Copiado!')}/>
                          </div>
                          <p className="text-xs text-muted-foreground">Compartilhe e acompanhe seus indicados abaixo.</p>
                      </CardContent>
                  </Card>
                  
                  <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground">Meus Convidados</h3>
                      {referrals?.map(ref => (
                          <div key={ref.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50">
                              <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                                      {ref.name.charAt(0)}
                                  </div>
                                  <div>
                                      <p className="font-medium text-sm">{ref.name}</p>
                                      <p className="text-xs text-muted-foreground">{ref.date}</p>
                                  </div>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                                  ${ref.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {ref.status === 'verified' ? 'Validado' : 'Pendente'}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {(activeTab === 'settings' || activeTab === 'about') && (
              <div className="text-center py-10 text-muted-foreground text-sm">
                  Funcionalidade em desenvolvimento.
              </div>
          )}
      </div>

      {/* QR Scanner Modal (Simulated) */}
      {showScanner && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
              <div className="absolute top-4 right-4 z-50">
                  <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0" onClick={() => setShowScanner(false)}>
                      <X className="h-6 w-6" />
                  </Button>
              </div>
              
              <div className="relative w-full max-w-sm aspect-[3/4] bg-slate-800 rounded-3xl overflow-hidden border-2 border-primary/50 shadow-[0_0_50px_rgba(255,107,44,0.3)]">
                  {/* Fake Camera Feed */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-50 grayscale"></div>
                  
                  {/* Scanner UI Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-64 h-64 border-2 border-white/80 rounded-3xl relative">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                          
                          {/* Scanning Animation */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_10px_rgba(255,107,44,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                      </div>
                      <p className="text-white mt-8 font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                          Aponte para o QR Code para pagar
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Wallet;
