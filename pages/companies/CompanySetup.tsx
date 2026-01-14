
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { PaymentSlider } from '../../components/ui/PaymentSlider';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Save, AlertCircle, CheckCircle2, Store, MapPin, FileText, Smartphone, Percent, Gift, ShieldCheck, FileCheck, UserSquare2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';

const CompanySetup = () => {
  const navigate = useNavigate();
  
  // Dados do Estabelecimento
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    cnpj: '',
    phone: '',
    cep: '',
    address: '',
    city: '',
    imageUrl: '',
    cnpjCardUrl: '', // Comprovante CNPJ
    documentPhotoUrl: '' // Documento do Dono
  });

  // Configuração de Pagamento e Benefícios
  const [cincoinPercentage, setCincoinPercentage] = useState(50);
  const [memberDiscount, setMemberDiscount] = useState(''); 
  const [isFullCrypto, setIsFullCrypto] = useState(false);
  const [hasMinimum, setHasMinimum] = useState(false);
  const [minimumValue, setMinimumValue] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load from local storage if exists
    const savedConfig = localStorage.getItem('company-full-config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setBusinessData(config.businessData || { 
        name: '', description: '', cnpj: '', phone: '', cep: '', address: '', city: '', imageUrl: '',
        cnpjCardUrl: '', documentPhotoUrl: ''
      });
      setCincoinPercentage(config.percentCincoin);
      setMemberDiscount(config.memberDiscount || '');
      setIsFullCrypto(config.percentCincoin === 100);
      setHasMinimum(!!config.minimum);
      setMinimumValue(config.minimum || '');
    }
  }, []);

  const handleSliderChange = (val: number) => {
    setCincoinPercentage(val);
    if (val < 100) setIsFullCrypto(false);
  };

  const handleFullCryptoToggle = () => {
    const newState = !isFullCrypto;
    setIsFullCrypto(newState);
    if (newState) setCincoinPercentage(100);
    else setCincoinPercentage(50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (field: string, base64: string) => {
      setBusinessData(prev => ({ ...prev, [field]: base64 }));
  };

  const handleSave = () => {
    // Validação básica e de documentos
    if (!businessData.cnpj || !businessData.address || !businessData.imageUrl) {
        alert("Por favor, preencha os dados básicos do estabelecimento (CNPJ, Endereço e Foto da Loja).");
        return;
    }

    if (!businessData.cnpjCardUrl || !businessData.documentPhotoUrl) {
        alert("Atenção: É obrigatório anexar o Cartão CNPJ e a Foto do Documento para comprovar a propriedade do negócio.");
        return;
    }

    const config = {
      businessData,
      percentCincoin: cincoinPercentage,
      percentBRL: 100 - cincoinPercentage,
      memberDiscount: memberDiscount,
      minimum: hasMinimum ? minimumValue : null,
      updatedAt: new Date().toISOString(),
      status: 'PENDING_VALIDATION'
    };
    
    localStorage.setItem('company-full-config', JSON.stringify(config));
    
    setIsSaved(true);
    setTimeout(() => {
        setIsSaved(false);
        navigate('/app/companies/cinplace/products');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pb-24">
      {isSaved && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">Cadastro Salvo! Indo para itens...</span>
          </div>
      )}

      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Cadastro de Parceiro</h1>
        <p className="text-muted-foreground">Preencha os dados para validar seu estabelecimento no Cinbusca e CinPlace.</p>
      </div>

      <div className="space-y-8">
        
        {/* Seção 1: Dados do Estabelecimento */}
        <Card className="border-border shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Store className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle>Dados do Estabelecimento</CardTitle>
                        <CardDescription>Informações públicas da sua loja.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        label="Nome do Estabelecimento" 
                        name="name" 
                        value={businessData.name} 
                        onChange={handleInputChange} 
                        placeholder="Ex: Café da Praça"
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-medium">CNPJ</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input 
                                name="cnpj"
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="00.000.000/0001-00"
                                value={businessData.cnpj}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição do Negócio</label>
                    <textarea 
                        name="description"
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        rows={3}
                        placeholder="Conte sobre sua loja, especialidades e o que você oferece..."
                        value={businessData.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Telefone / WhatsApp</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input 
                                name="phone"
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="(00) 00000-0000"
                                value={businessData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                     <Input 
                        label="CEP" 
                        name="cep" 
                        value={businessData.cep} 
                        onChange={handleInputChange} 
                        placeholder="00000-000"
                    />
                </div>

                <div className="space-y-2">
                     <label className="text-sm font-medium">Endereço Completo</label>
                     <div className="relative">
                         <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <input 
                             name="address"
                             className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                             placeholder="Rua, Número, Bairro"
                             value={businessData.address}
                             onChange={handleInputChange}
                         />
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input 
                        label="Cidade" 
                        name="city" 
                        value={businessData.city} 
                        onChange={handleInputChange} 
                     />
                     <div className="space-y-2">
                        <ImageUpload 
                            label="Foto da Fachada/Loja"
                            value={businessData.imageUrl}
                            onChange={(val) => handleImageChange('imageUrl', val)}
                            placeholder="Toque para adicionar foto da loja"
                        />
                     </div>
                </div>

                {/* Sub-seção de Validação de Documentos */}
                <div className="border-t border-border pt-6 mt-2">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                        <h3 className="font-semibold text-sm">Validação de Propriedade (Obrigatório)</h3>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-4">
                        <p className="text-xs text-muted-foreground">
                            Para evitar fraudes, precisamos comprovar que você é o proprietário legal deste estabelecimento. 
                            Esses documentos <strong>não serão exibidos publicamente</strong>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <FileCheck className="h-4 w-4 text-muted-foreground" />
                                Cartão CNPJ
                            </label>
                            <ImageUpload 
                                value={businessData.cnpjCardUrl}
                                onChange={(val) => handleImageChange('cnpjCardUrl', val)}
                                placeholder="Foto/Print do Cartão CNPJ"
                            />
                            <p className="text-[10px] text-muted-foreground">Comprovante de Inscrição e Situação Cadastral.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <UserSquare2 className="h-4 w-4 text-muted-foreground" />
                                Documento do Responsável
                            </label>
                            <ImageUpload 
                                value={businessData.documentPhotoUrl}
                                onChange={(val) => handleImageChange('documentPhotoUrl', val)}
                                placeholder="Foto do RG ou CNH"
                            />
                            <p className="text-[10px] text-muted-foreground">Documento com foto do sócio administrador.</p>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>

        {/* Seção 2: Configuração de Pagamento e Benefícios */}
        <Card className="border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        $
                    </div>
                    <div>
                        <CardTitle>Pagamento & Benefícios</CardTitle>
                        <CardDescription>Defina aceitação de tokens e descontos para a comunidade.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
            
            {/* Benefício Exclusivo (Desconto) */}
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Gift className="h-5 w-5" />
                    <span className="font-bold text-sm">Benefício para Membros Cincoin</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Lojas que oferecem descontos exclusivos ganham destaque no topo das buscas e atraem mais clientes fiéis.
                </p>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <Input 
                            label="Desconto na compra (%)"
                            placeholder="Ex: 10" 
                            type="number"
                            min="0"
                            max="100"
                            value={memberDiscount}
                            onChange={(e) => setMemberDiscount(e.target.value)}
                            className="bg-background"
                        />
                    </div>
                    <div className="pb-2 text-sm text-muted-foreground font-medium">
                        {memberDiscount ? `-${memberDiscount}% OFF para membros` : 'Sem desconto'}
                    </div>
                </div>
            </div>

            {/* Slider Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Split de Pagamento (Aceitação)</h4>
                </div>

                <PaymentSlider cincoinPercentage={cincoinPercentage} onChange={handleSliderChange} />
                
                {/* Preview Box */}
                <div className="bg-muted/40 p-4 rounded-xl border border-border/50 text-sm space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-semibold">Simulação para o Cliente:</span>
                    </div>
                    <div className="space-y-1 pl-6 border-l-2 border-primary/30">
                        <p>Em uma compra de <span className="font-bold text-foreground">R$ 100,00</span>:</p>
                        
                        {/* Lógica de exibição com desconto */}
                        {memberDiscount && Number(memberDiscount) > 0 ? (
                           <>
                             <p className="text-xs text-green-600 font-bold">Aplicando {memberDiscount}% de desconto...</p>
                             <p className="text-muted-foreground line-through text-xs">Total: R$ 100,00</p>
                             <p className="font-bold">Novo Total: R$ {100 - Number(memberDiscount)},00</p>
                             <ul className="list-disc pl-4 space-y-1 text-muted-foreground mt-2">
                                <li>Paga <span className="font-bold text-primary">R$ {((100 - Number(memberDiscount)) * (cincoinPercentage / 100)).toFixed(2)} em Cincoin</span></li>
                                <li>Paga <span className="font-bold text-blue-500">R$ {((100 - Number(memberDiscount)) * ((100 - cincoinPercentage) / 100)).toFixed(2)} em Dinheiro</span></li>
                             </ul>
                           </>
                        ) : (
                           <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                               <li>Ele paga <span className="font-bold text-primary">R$ {cincoinPercentage},00 em Cincoin</span></li>
                               <li>Ele paga <span className="font-bold text-blue-500">R$ {100 - cincoinPercentage},00 em Dinheiro</span></li>
                           </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Options Section */}
            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleFullCryptoToggle}>
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium cursor-pointer">Aceitar 100% Cincoin</label>
                        <p className="text-xs text-muted-foreground">Torne seu negócio "Crypto-First".</p>
                    </div>
                    <div className={`h-6 w-6 rounded-md border flex items-center justify-center transition-colors ${isFullCrypto ? 'bg-primary border-primary text-white' : 'border-input'}`}>
                        {isFullCrypto && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setHasMinimum(!hasMinimum)}>
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium cursor-pointer">Definir mínimo de compra</label>
                            <p className="text-xs text-muted-foreground">Valor mínimo para aceitar pagamento misto.</p>
                        </div>
                        <div className={`h-6 w-6 rounded-md border flex items-center justify-center transition-colors ${hasMinimum ? 'bg-primary border-primary text-white' : 'border-input'}`}>
                            {hasMinimum && <CheckCircle2 className="h-4 w-4" />}
                        </div>
                    </div>
                    
                    {hasMinimum && (
                        <div className="pl-3 animate-in slide-in-from-top-2 fade-in">
                            <Input 
                                placeholder="Ex: 50.00" 
                                label="Valor mínimo em R$" 
                                value={minimumValue}
                                onChange={(e) => setMinimumValue(e.target.value)}
                                type="number"
                            />
                        </div>
                    )}
                </div>
            </div>

            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-border pt-6 bg-muted/20">
                <div className="text-xs text-muted-foreground text-center px-4">
                    Ao salvar, você confirma que os documentos enviados são autênticos. Falsificação de identidade é crime e resultará no banimento permanente da plataforma.
                </div>
                <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => navigate('/app/companies')}>Cancelar</Button>
                    <Button className="flex-1 font-bold" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" /> Salvar e Cadastrar Itens
                    </Button>
                </div>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CompanySetup;
