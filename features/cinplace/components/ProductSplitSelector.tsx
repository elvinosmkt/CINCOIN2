
import React, { useState, useEffect } from 'react';
import { AcceptType } from '../../../types/cinplace';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../lib/utils';
import { AlertCircle } from 'lucide-react';

interface ProductSplitSelectorProps {
  priceFiat: number;
  acceptType: AcceptType;
  fixedCinPercent?: number;
  minCinPercent?: number;
  maxCinPercent?: number;
  onSplitChange: (cinPercent: number, cinAmount: number, fiatAmount: number) => void;
  userBalance: number;
}

export const ProductSplitSelector: React.FC<ProductSplitSelectorProps> = ({
  priceFiat,
  acceptType,
  fixedCinPercent = 0,
  minCinPercent = 0,
  maxCinPercent = 100,
  onSplitChange,
  userBalance
}) => {
  // Default to fixed value or min value
  const [percent, setPercent] = useState<number>(acceptType === 'FIXED' ? fixedCinPercent : minCinPercent);

  // Constants
  const CNC_RATE = 0.50; // Mock Rate: 1 CNC = R$ 0,50

  useEffect(() => {
    const cinValueBRL = priceFiat * (percent / 100);
    const cinAmount = cinValueBRL / CNC_RATE;
    const fiatAmount = priceFiat - cinValueBRL;
    onSplitChange(percent, cinAmount, fiatAmount);
  }, [percent, priceFiat, onSplitChange]);

  const cinValueBRL = priceFiat * (percent / 100);
  const cinAmount = cinValueBRL / CNC_RATE;
  const fiatAmount = priceFiat - cinValueBRL;
  const hasBalance = userBalance >= cinAmount;

  return (
    <Card className="p-6 space-y-6 border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <div>
        <h3 className="font-semibold mb-1">Como você quer pagar?</h3>
        <p className="text-xs text-muted-foreground">
          {acceptType === 'FIXED' 
            ? 'Este vendedor definiu um percentual fixo de Cincoin.'
            : 'Este vendedor aceita uma faixa de negociação.'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Slider Controls */}
        <div className="space-y-2">
           <div className="flex justify-between text-sm font-medium">
              <span className="text-primary">{percent}% Cincoin</span>
              <span className="text-blue-500">{100 - percent}% Dinheiro</span>
           </div>
           <input 
             type="range"
             min={acceptType === 'FIXED' ? 0 : minCinPercent}
             max={acceptType === 'FIXED' ? 100 : maxCinPercent}
             value={percent}
             onChange={(e) => setPercent(Number(e.target.value))}
             disabled={acceptType === 'FIXED'}
             className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${acceptType === 'FIXED' ? 'bg-muted cursor-not-allowed' : 'bg-gradient-to-r from-primary to-blue-500'}`}
           />
           {acceptType === 'RANGE' && (
             <div className="flex justify-between text-xs text-muted-foreground">
               <span>Mín: {minCinPercent}%</span>
               <span>Máx: {maxCinPercent}%</span>
             </div>
           )}
        </div>

        {/* Calculation Display */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-card/50 p-3 rounded-xl border border-primary/30">
              <span className="text-xs text-muted-foreground uppercase">Você paga em CNC</span>
              <div className="text-xl font-bold text-primary">{cinAmount.toLocaleString('pt-BR')} CNC</div>
              <div className="text-[10px] text-muted-foreground">≈ {formatCurrency(cinValueBRL, 'BRL')}</div>
           </div>
           <div className="bg-card/50 p-3 rounded-xl border border-blue-500/30">
              <span className="text-xs text-muted-foreground uppercase">Você paga em BRL</span>
              <div className="text-xl font-bold text-blue-500">{formatCurrency(fiatAmount, 'BRL')}</div>
           </div>
        </div>

        {/* Balance Warning */}
        {!hasBalance && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm border border-red-500/20">
             <AlertCircle className="h-4 w-4" />
             <span>Saldo insuficiente. Você tem {userBalance.toLocaleString('pt-BR')} CNC.</span>
          </div>
        )}
      </div>
    </Card>
  );
};
