import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { PaymentSlider } from '../../components/ui/PaymentSlider';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';

const CompanySetup = () => {
  const navigate = useNavigate();
  const [cincoinPercentage, setCincoinPercentage] = useState(50);
  const [isFullCrypto, setIsFullCrypto] = useState(false);
  const [hasMinimum, setHasMinimum] = useState(false);
  const [minimumValue, setMinimumValue] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load from local storage if exists
    const savedConfig = localStorage.getItem('company-payment-config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setCincoinPercentage(config.percentCincoin);
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

  const handleSave = () => {
    const config = {
      percentCincoin: cincoinPercentage,
      percentBRL: 100 - cincoinPercentage,
      minimum: hasMinimum ? minimumValue : null,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('company-payment-config', JSON.stringify(config));
    
    setIsSaved(true);
    setTimeout(() => {
        setIsSaved(false);
        navigate('/app/companies'); // Redirect to Cinbusca after save
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {isSaved && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">Configuração salva com sucesso!</span>
          </div>
      )}

      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Como Você Recebe?</h1>
        <p className="text-muted-foreground">Configure as regras de recebimento em Cincoin para o seu negócio.</p>
      </div>

      <Card className="border-primary/20 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle>Split de Pagamento</CardTitle>
          <CardDescription>Defina quanto você aceita em tokens e quanto em dinheiro.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Slider Section */}
          <div className="space-y-6">
             <PaymentSlider cincoinPercentage={cincoinPercentage} onChange={handleSliderChange} />
             
             {/* Preview Box */}
             <div className="bg-muted/40 p-4 rounded-xl border border-border/50 text-sm space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-semibold">Simulação para o Cliente:</span>
                </div>
                <div className="space-y-1 pl-6 border-l-2 border-primary/30">
                    <p>Em uma compra de <span className="font-bold text-foreground">R$ 100,00</span>:</p>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        <li>Ele paga <span className="font-bold text-primary">R$ {cincoinPercentage},00 em Cincoin</span></li>
                        <li>Ele paga <span className="font-bold text-blue-500">R$ {100 - cincoinPercentage},00 em Dinheiro</span></li>
                    </ul>
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
        <CardFooter className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/app/companies')}>Cancelar</Button>
            <Button className="flex-1 font-bold" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Salvar Configuração
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompanySetup;
