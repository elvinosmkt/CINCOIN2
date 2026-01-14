
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  QrCode, CreditCard, Users, FileText, Info, ShoppingCart, 
  Copy, Share2, Scan, X, User, ShieldCheck, ShieldAlert, UploadCloud, 
  Bell, Lock, Clock, LogOut, ChevronRight, Camera, Key, RefreshCw, UserCog,
  FileCheck, AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';

const Wallet = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'statement' | 'receive' | 'orders' | 'referrals' | 'profile'>('statement');
  const [showScanner, setShowScanner] = useState(false);
  
  // State para navegação interna do Perfil
  const [profileView, setProfileView] = useState<'menu' | 'security' | 'data'>('menu');

  // Queries
  const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: api.user.getTransactions });
  const { data: sellQueue } = useQuery({ queryKey: ['sellQueue'], queryFn: api.exchange.getSellQueue });
  const { data: referrals } = useQuery({ queryKey: ['referrals'], queryFn: api.user.getReferrals });
  const { data: adminPrice } = useQuery({ queryKey: ['adminPrice'], queryFn: api.exchange.getAdminPrice });
  const { data: userProfile } = useQuery({ queryKey: ['user'], queryFn: api.user.getProfile });

  const kycMutation = useMutation({
      mutationFn: api.user.requestKyc,
      onSuccess: () => {
          alert("Solicitação enviada! Seus documentos serão analisados em até 24h.");
          queryClient.invalidateQueries({ queryKey: ['user'] });
      }
  });

  const currentPrice = adminPrice?.price || 0.50;
  const fiatValue = (user?.balance || 0) * currentPrice;
  const walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"; // Mock Address

  const handlePayScan = () => {
      if (userProfile?.kycStatus !== 'verified') {
          alert("Ação bloqueada: Para realizar pagamentos ou saques, você deve primeiro validar sua identidade na aba 'Perfil' > 'Segurança da conta'.");
          return;
      }
      setShowScanner(true);
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

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

  const ProfileMenuItem = ({ icon: Icon, title, subtitle, onClick, badge }: any) => (
      <div 
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-card hover:bg-muted/50 rounded-lg border border-border/40 cursor-pointer transition-colors group"
      >
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm flex items-center gap-2">
                  {title}
                  {badge && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-600 rounded">{badge}</span>}
              </h4>
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      
      {/* 1. Header com Saldos (apenas se não estiver no perfil ou estiver na raiz do perfil) */}
      {activeTab !== 'profile' && (
        <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">Minha Carteira</h2>
            
            {/* Main Balance Card */}
            <div className="bg-gradient-to-br from-slate-900 to-black text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-white/10">
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
      )}

      {/* 2. Promo Banner (Ocultar no perfil) */}
      {activeTab !== 'profile' && (
        <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
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
      )}

      {/* 3. Main Actions (Ocultar no perfil) */}
      {activeTab !== 'profile' && (
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
                onClick={handlePayScan}
            >
                <Scan className="h-6 w-6" />
                <span>Pagar</span>
            </Button>
        </div>
      )}

      {/* 4. Menu Tabs (Scrollable Row) */}
      <div className="flex justify-between overflow-x-auto pb-2 border-b border-border/50 gap-2">
         <TabButton id="statement" icon={FileText} label="Extrato" />
         <TabButton id="receive" icon={QrCode} label="Receber" />
         <TabButton id="orders" icon={CreditCard} label="Ordens" />
         <TabButton id="referrals" icon={Users} label="Convidados" />
         <TabButton id="profile" icon={User} label="Perfil" />
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

          {activeTab === 'receive' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-center space-y-2">
                      <h3 className="font-semibold text-lg">Receber Cincoin</h3>
                      <p className="text-sm text-muted-foreground">Utilize o QR Code ou endereço abaixo para receber tokens CNC.</p>
                  </div>

                  <Card className="overflow-hidden bg-white/5 border-white/10">
                      <CardContent className="p-8 flex flex-col items-center gap-6">
                          <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-white">
                              {/* Using a public QR code API for demonstration */}
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}&bgcolor=ffffff`}
                                alt="Wallet QR Code" 
                                className="w-48 h-48"
                              />
                          </div>
                          
                          <div className="w-full space-y-2">
                              <label className="text-xs font-medium text-muted-foreground uppercase text-center block">Seu Endereço de Carteira</label>
                              <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg border border-border/50">
                                  <span className="font-mono text-xs sm:text-sm break-all text-center flex-1 text-foreground/80">
                                      {walletAddress}
                                  </span>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 hover:bg-background" onClick={() => alert('Endereço copiado!')}>
                                      <Copy className="h-4 w-4" />
                                  </Button>
                              </div>
                          </div>

                          <div className="flex items-start gap-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-4 py-3 rounded-lg text-left">
                             <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                             <span><strong>Atenção:</strong> Envie apenas tokens Cincoin (CNC) para este endereço. O envio de outros ativos pode resultar em perda permanente.</span>
                          </div>
                      </CardContent>
                  </Card>
                  
                  <div className="flex justify-center">
                     <Button variant="outline" className="w-full" onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Minha Carteira Cincoin',
                                text: `Envie CNC para: ${walletAddress}`,
                                url: ''
                            }).catch(() => {});
                        } else {
                            alert('Endereço copiado para a área de transferência!');
                        }
                     }}>
                        <Share2 className="mr-2 h-4 w-4" /> Compartilhar Endereço
                     </Button>
                  </div>
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

          {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                   
                   {/* Main Menu View */}
                   {profileView === 'menu' && (
                       <div className="space-y-6">
                           {/* User Header */}
                           <div className="text-center pt-2 pb-4">
                               <div className="relative inline-block">
                                   <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center overflow-hidden mx-auto mb-4 border-4 border-background shadow-xl">
                                      <span className="text-4xl font-bold text-muted-foreground">{user?.name?.charAt(0)}</span>
                                   </div>
                                   <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                      <Camera className="h-4 w-4" />
                                   </div>
                               </div>
                               <h3 className="text-xl font-medium text-foreground">{user?.name}</h3>
                               <p className="text-sm text-muted-foreground mt-1">Mantenha seus dados atualizados.</p>
                           </div>

                           {/* Menu Items */}
                           <div className="space-y-2 pb-4">
                               <ProfileMenuItem 
                                   icon={FileText} 
                                   title="Ordens" 
                                   subtitle="Acompanhamento de contribuições." 
                                   onClick={() => setActiveTab('orders')}
                               />
                               
                               <ProfileMenuItem 
                                   icon={ShieldCheck} 
                                   title="Segurança da conta" 
                                   subtitle="Confira os itens de segurança." 
                                   badge={userProfile?.kycStatus !== 'verified' ? 'Validar Agora' : undefined}
                                   onClick={() => setProfileView('security')} 
                               />
                               
                               <ProfileMenuItem 
                                   icon={CreditCard} 
                                   title="Meus Cartões" 
                                   subtitle="Adicione cartões para facilitar pagamentos." 
                               />
                               
                               <ProfileMenuItem 
                                   icon={UserCog} 
                                   title="Meus Dados" 
                                   subtitle="Editar nome, e-mail, telefone, etc." 
                                   onClick={() => setProfileView('data')}
                               />
                               
                               <ProfileMenuItem 
                                   icon={Key} 
                                   title="Alterar senha" 
                                   subtitle="Redefinir sua senha atual." 
                               />
                               
                               <ProfileMenuItem 
                                   icon={RefreshCw} 
                                   title="Redefinir Cadastro" 
                                   subtitle="Redefinir senha numérica e dois fatores." 
                               />
                               
                               <ProfileMenuItem 
                                   icon={LogOut} 
                                   title="Sair" 
                                   subtitle="Refazer login." 
                                   onClick={handleLogout} 
                               />
                           </div>
                       </div>
                   )}

                   {/* Security/KYC View */}
                   {profileView === 'security' && (
                       <div className="space-y-6">
                           <div className="flex items-center gap-2 mb-4">
                               <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => setProfileView('menu')}>
                                   <X className="h-5 w-5" /> Voltar
                               </Button>
                               <h3 className="font-bold text-lg ml-auto mr-auto">Segurança</h3>
                               <div className="w-8"></div>
                           </div>

                           <Card className={
                               userProfile?.kycStatus === 'verified' ? 'border-green-500/20 bg-green-500/5' : 
                               userProfile?.kycStatus === 'pending' ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-red-500/20 bg-red-500/5'
                           }>
                               <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                   {userProfile?.kycStatus === 'verified' ? (
                                       <ShieldCheck className="h-16 w-16 text-green-500" />
                                   ) : userProfile?.kycStatus === 'pending' ? (
                                       <Clock className="h-16 w-16 text-yellow-500" />
                                   ) : (
                                       <ShieldAlert className="h-16 w-16 text-red-500" />
                                   )}
                                   
                                   <div>
                                       <h4 className="font-bold text-lg">Status da Identidade</h4>
                                       <p className="text-sm opacity-80 mt-1">
                                           {userProfile?.kycStatus === 'verified' && "Sua conta está verificada e segura."}
                                           {userProfile?.kycStatus === 'pending' && "Seus documentos estão em análise."}
                                           {userProfile?.kycStatus === 'unverified' && "Validação necessária para desbloquear saques."}
                                       </p>
                                   </div>
                               </CardContent>
                           </Card>

                           {userProfile?.kycStatus === 'unverified' && (
                               <div className="space-y-4">
                                   <h4 className="text-sm font-bold border-b pb-2">Envio de Documentos</h4>
                                   <Input placeholder="CPF" />
                                   <Button variant="outline" className="w-full justify-start h-12">
                                       <UploadCloud className="mr-2 h-4 w-4" /> Enviar Foto do RG/CNH
                                   </Button>
                                   <Button variant="outline" className="w-full justify-start h-12">
                                       <UploadCloud className="mr-2 h-4 w-4" /> Enviar Selfie com Documento
                                   </Button>
                                   <Button className="w-full font-bold" onClick={() => kycMutation.mutate({})}>
                                       Solicitar Verificação
                                   </Button>
                               </div>
                           )}
                       </div>
                   )}

                   {/* Data Edit View (Mock) */}
                   {profileView === 'data' && (
                       <div className="space-y-6">
                           <div className="flex items-center gap-2 mb-4">
                               <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => setProfileView('menu')}>
                                   <X className="h-5 w-5" /> Voltar
                               </Button>
                               <h3 className="font-bold text-lg ml-auto mr-auto">Meus Dados</h3>
                               <div className="w-8"></div>
                           </div>
                           <Input label="Nome Completo" defaultValue={user?.name} />
                           <Input label="E-mail" defaultValue={user?.email} disabled />
                           <Input label="Telefone" defaultValue="+55 47 99999-9999" />
                           <Button className="w-full">Salvar Alterações</Button>
                       </div>
                   )}
              </div>
          )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
              <div className="absolute top-4 right-4 z-50">
                  <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0" onClick={() => setShowScanner(false)}>
                      <X className="h-6 w-6" />
                  </Button>
              </div>
              
              <div className="relative w-full max-w-sm aspect-[3/4] bg-slate-800 rounded-3xl overflow-hidden border-2 border-primary/50 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-50 grayscale"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-64 h-64 border-2 border-white/80 rounded-3xl relative">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
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
