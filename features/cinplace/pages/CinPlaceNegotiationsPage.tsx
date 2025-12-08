
import React from 'react';
import { useAuthStore } from '../../../store/useStore';
import { useCompanyNegotiations, useUpdateNegotiationStatus } from '../../../hooks/useCinPlace';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Check, X } from 'lucide-react';

export const CinPlaceNegotiationsPage = () => {
  const { user } = useAuthStore();
  const { data: negotiations, isLoading } = useCompanyNegotiations(user?.id || 'c_1');
  const updateStatus = useUpdateNegotiationStatus();

  return (
    <div className="space-y-6">
       <div>
           <h2 className="text-3xl font-bold">Propostas de Negociação</h2>
           <p className="text-muted-foreground">Gerencie ofertas de split diferenciado enviadas por compradores.</p>
       </div>

       {isLoading ? <div>Carregando...</div> : (
           <div className="space-y-4">
               {negotiations?.length === 0 && <div className="text-muted-foreground">Nenhuma proposta pendente.</div>}
               
               {negotiations?.map(n => (
                   <Card key={n.id} className="overflow-hidden">
                       <CardContent className="p-0 flex flex-col md:flex-row">
                           <div className="p-4 flex-1 space-y-1">
                               <div className="flex items-center gap-2">
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                                       ${n.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 
                                         n.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                       {n.status}
                                   </span>
                                   <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
                               </div>
                               <h3 className="font-bold">{n.productName}</h3>
                               <p className="text-sm text-muted-foreground">
                                   Comprador: <span className="text-foreground">{n.buyerName}</span>
                               </p>
                           </div>

                           <div className="p-4 bg-muted/20 flex flex-col justify-center items-center min-w-[150px] border-l border-border/50">
                               <span className="text-xs text-muted-foreground">Solicitado</span>
                               <span className="text-2xl font-bold text-primary">{n.requestedCinPercent}%</span>
                               <span className="text-[10px] uppercase tracking-wide">em Cincoin</span>
                           </div>

                           {n.status === 'PENDING' && (
                               <div className="p-4 flex items-center gap-2 border-l border-border/50">
                                   <Button 
                                       size="sm" 
                                       className="bg-green-600 hover:bg-green-700 h-10 w-10 p-0 rounded-full"
                                       onClick={() => updateStatus.mutate({ id: n.id, status: 'APPROVED' })}
                                       disabled={updateStatus.isPending}
                                   >
                                       <Check className="h-4 w-4" />
                                   </Button>
                                   <Button 
                                       size="sm" 
                                       variant="destructive"
                                       className="h-10 w-10 p-0 rounded-full"
                                       onClick={() => updateStatus.mutate({ id: n.id, status: 'REJECTED' })}
                                       disabled={updateStatus.isPending}
                                   >
                                       <X className="h-4 w-4" />
                                   </Button>
                               </div>
                           )}
                       </CardContent>
                   </Card>
               ))}
           </div>
       )}
    </div>
  );
};
