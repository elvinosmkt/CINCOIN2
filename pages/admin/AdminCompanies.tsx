
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, UserSquare2, Check, X, Building, MapPin, ExternalLink } from 'lucide-react';
import { CincoinBadge } from '../../components/ui/CincoinBadge';

const AdminCompanies = () => {
    const queryClient = useQueryClient();
    const { data: companies, isLoading } = useQuery({ queryKey: ['admin-companies'], queryFn: api.admin.getPendingCompanies });

    const approveMutation = useMutation({
        mutationFn: api.admin.approveCompany,
        onSuccess: () => {
            alert("Empresa aprovada e publicada no CinBusca!");
            queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: api.admin.rejectCompany,
        onSuccess: () => {
            alert("Cadastro rejeitado.");
            queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Validação de Parceiros</h1>
                <p className="text-muted-foreground">Analise os documentos obrigatórios para aprovar novos estabelecimentos.</p>
            </div>

            {isLoading && <div>Carregando solicitações...</div>}

            {companies?.length === 0 && (
                <div className="p-12 text-center border border-dashed rounded-xl text-muted-foreground bg-muted/20">
                    <Building className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhuma solicitação pendente no momento.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {companies?.map(company => (
                    <Card key={company.id} className="overflow-hidden border-l-4 border-l-amber-500 shadow-md">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-background border flex items-center justify-center overflow-hidden">
                                        <img src={company.image} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{company.name}</h3>
                                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                                            <span className="bg-background px-1.5 py-0.5 rounded border">{company.category}</span>
                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {company.city}/{company.state}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold uppercase">
                                        Pendente
                                    </span>
                                    <div className="text-[10px] text-muted-foreground mt-1">
                                        {new Date(company.requestDate || '').toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {/* Detalhes do Negócio */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/10 p-3 rounded-lg border">
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase font-bold">CNPJ Informado</p>
                                    <p className="font-mono text-foreground">{company.cnpj}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase font-bold">Responsável Legal</p>
                                    <p>{company.ownerName}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-muted-foreground text-xs uppercase font-bold">Endereço</p>
                                    <p>{company.address}</p>
                                </div>
                            </div>

                            {/* Área de Documentos - Destaque */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                    <FileText className="h-3 w-3" /> Documentação Anexada
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button 
                                        variant="outline" 
                                        className="h-auto py-3 justify-start gap-2 hover:bg-blue-50 hover:text-blue-600 border-blue-200"
                                        onClick={() => window.open(company.cnpjCardUrl, '_blank')}
                                    >
                                        <div className="bg-blue-100 p-1.5 rounded text-blue-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-bold">Cartão CNPJ</div>
                                            <div className="text-[10px] text-muted-foreground">Clique para abrir PDF</div>
                                        </div>
                                        <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                                    </Button>

                                    <Button 
                                        variant="outline" 
                                        className="h-auto py-3 justify-start gap-2 hover:bg-purple-50 hover:text-purple-600 border-purple-200"
                                        onClick={() => window.open(company.documentPhotoUrl, '_blank')}
                                    >
                                        <div className="bg-purple-100 p-1.5 rounded text-purple-600">
                                            <UserSquare2 className="h-4 w-4" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-bold">Doc. Sócio</div>
                                            <div className="text-[10px] text-muted-foreground">RG/CNH com Foto</div>
                                        </div>
                                        <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between bg-muted/20 p-2 rounded">
                                <span className="text-xs font-medium">Split Proposto:</span>
                                <CincoinBadge percentage={company.percentCincoin} />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 p-4 flex gap-3">
                            <Button 
                                className="flex-1 bg-green-600 hover:bg-green-700 font-bold" 
                                onClick={() => {
                                    if(window.confirm(`Confirma que visualizou os documentos e que a empresa ${company.name} está apta?`)) {
                                        approveMutation.mutate(String(company.id))
                                    }
                                }}
                            >
                                <Check className="h-4 w-4 mr-2" /> Validar & Aprovar
                            </Button>
                            <Button 
                                variant="destructive" 
                                className="flex-1"
                                onClick={() => {
                                    if(window.confirm('Tem certeza que deseja rejeitar este cadastro?')) {
                                        rejectMutation.mutate(String(company.id))
                                    }
                                }}
                            >
                                <X className="h-4 w-4 mr-2" /> Rejeitar
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminCompanies;
