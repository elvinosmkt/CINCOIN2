import React from 'react';
import { cn } from '../../lib/utils';

interface PaymentSliderProps {
  cincoinPercentage: number;
  onChange: (val: number) => void;
  className?: string;
  readOnly?: boolean;
}

export const PaymentSlider: React.FC<PaymentSliderProps> = ({ 
  cincoinPercentage, 
  onChange, 
  className,
  readOnly = false 
}) => {
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 bg-card/50 p-3 rounded-xl border border-primary/20 flex flex-col items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Pagamento em Cincoin</span>
            <span className="text-2xl font-bold text-primary">{cincoinPercentage}%</span>
        </div>
        <div className="flex-1 bg-card/50 p-3 rounded-xl border border-blue-500/20 flex flex-col items-center">
             <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Pagamento em BRL</span>
             <span className="text-2xl font-bold text-blue-500">{100 - cincoinPercentage}%</span>
        </div>
      </div>

      <div className="relative h-10 w-full mt-2">
        {/* Background Track */}
        <div className="absolute top-0 left-0 h-4 w-full rounded-full overflow-hidden mt-3">
          <div className="h-full w-full bg-gradient-to-r from-primary to-blue-500"></div>
        </div>
        
        {/* Input Range */}
        {!readOnly && (
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={cincoinPercentage} 
            onChange={handleRangeChange}
            className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer z-20"
          />
        )}

        {/* Custom Thumb / Marker Visual */}
        <div 
            className="absolute top-1 z-10 h-8 w-8 bg-white rounded-full shadow-lg border-4 border-primary transition-all duration-75 ease-out pointer-events-none"
            style={{ left: `calc(${cincoinPercentage}% - 16px)` }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
            </div>
        </div>
      </div>
    </div>
  );
};
