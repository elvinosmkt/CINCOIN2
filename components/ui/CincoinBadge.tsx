import React from 'react';
import { cn } from '../../lib/utils';
import { Sparkles, Check } from 'lucide-react';

interface CincoinBadgeProps {
  percentage: number;
  className?: string;
}

export const CincoinBadge: React.FC<CincoinBadgeProps> = ({ percentage, className }) => {
  const isFullCrypto = percentage === 100;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm transition-all hover:scale-105",
      isFullCrypto 
        ? "bg-primary text-primary-foreground shadow-primary/20" 
        : "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20",
      className
    )}>
      {isFullCrypto ? (
        <Sparkles className="h-3 w-3 fill-current" />
      ) : (
        <Check className="h-3 w-3" />
      )}
      <span>
        {isFullCrypto ? "100% Cincoin" : `Aceita ${percentage}% CNC`}
      </span>
    </div>
  );
};
