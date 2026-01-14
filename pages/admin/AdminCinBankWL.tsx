
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Cpu, CheckCircle2, Link, Lock } from 'lucide-react';

const AdminCinBankWL = () => {
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Cpu className="h-8 w-8 text-blue-500" /> Integração CinBank (White Label)
                </h1>
                <p className="text-muted-foreground">Gestão da conexão com a provedora de Banking-as-a-Service (BaaS).</p>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                 <Card className="border-green-500/30 bg-green-500/5">
                     <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-green-700">
                             <CheckCircle2 className="h-5 w-5" /> Status da Conexão: ATIVO
                         </CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-sm text-muted-foreground mb-4">
                             A integração com o core bancário externo está operando normalmente. Todas as transações de PIX, emissão de boletos e cartões estão sincronizadas.
                         </p>
                         <div className="space-y-2 text-sm font-mono bg-background p-3 rounded border">
                             <div className="flex justify-between">
                                 <span className="text-muted-foreground">Provider:</span>
                                 <span>Dock / BaaS Provider</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-muted-foreground">Latency:</span>
                                 <span className="text-green-600">24ms</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-muted-foreground">Last Sync:</span>
                                 <span>{new Date().toLocaleTimeString()}</span>
                             </div>
                         </div>
                     </CardContent>
                 </Card>

                 <Card>
                     <CardHeader>
                         <CardTitle>Configuração de API</CardTitle>
                         <CardDescription>Credenciais de acesso ao ambiente BaaS.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                         <div className="space-y-1">
                             <label className="text-xs font-bold text-muted-foreground uppercase">Client ID</label>
                             <div className="flex items-center gap-2 bg-muted p-2 rounded">
                                 <Lock className="h-3 w-3 text-muted-foreground" />
                                 <span className="font-mono text-sm">client_live_8293...x8s9</span>
                             </div>
                         </div>
                         <div className="space-y-1">
                             <label className="text-xs font-bold text-muted-foreground uppercase">Webhook URL</label>
                             <div className="flex items-center gap-2 bg-muted p-2 rounded">
                                 <Link className="h-3 w-3 text-muted-foreground" />
                                 <span className="font-mono text-sm">https://api.cincoin.asia/webhooks/baas</span>
                             </div>
                         </div>
                         <Button variant="outline" className="w-full">
                             Acessar Painel do Provedor (Externo)
                         </Button>
                     </CardContent>
                 </Card>
             </div>
        </div>
    );
};

export default AdminCinBankWL;
