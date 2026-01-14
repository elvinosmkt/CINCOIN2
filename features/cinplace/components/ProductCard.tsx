
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CinPlaceProduct } from '../../../types/cinplace';
import { Card, CardContent, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ShoppingBag, Tag } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { CincoinBadge } from '../../../components/ui/CincoinBadge';

interface ProductCardProps {
  product: CinPlaceProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  // Determine badge text/style
  const getAcceptanceLabel = () => {
    if (product.acceptType === 'FIXED') {
      return product.fixedCinPercent;
    }
    return product.maxCinPercent; // Show max potential
  };

  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const finalPrice = hasDiscount 
    ? product.priceFiat * (1 - (product.discountPercent! / 100))
    : product.priceFiat;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden flex flex-col h-full border-border/50 hover:shadow-xl hover:border-primary/30 transition-all">
        <div className="relative aspect-square w-full overflow-hidden bg-muted group cursor-pointer" onClick={() => navigate(`/app/cinplace/${product.id}`)}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {hasDiscount && (
                <span className="bg-green-600 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-md shadow-md animate-pulse flex items-center gap-1">
                   <Tag className="h-3 w-3" /> -{product.discountPercent}%
                </span>
            )}
          </div>
          <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 scale-90 origin-bottom-left md:scale-100">
             <CincoinBadge percentage={getAcceptanceLabel() || 0} />
          </div>
        </div>

        <CardContent className="p-3 md:p-4 flex-1 flex flex-col gap-1 md:gap-2">
          <div>
            <h3 className="font-bold text-sm md:text-lg leading-tight line-clamp-2 md:line-clamp-1">{product.name}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground truncate">{product.sellerName}</p>
          </div>
          
          <div className="mt-auto pt-1 md:pt-2">
             {hasDiscount && (
                 <span className="text-[10px] md:text-xs text-muted-foreground line-through mr-2 block md:inline">
                     {formatCurrency(product.priceFiat, 'BRL')}
                 </span>
             )}
             <div className="text-base md:text-lg font-bold text-foreground">
                {formatCurrency(finalPrice, 'BRL')}
             </div>
             <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">
                {product.acceptType === 'FIXED' 
                  ? `Aceita ${product.fixedCinPercent}% CNC`
                  : `Aceita ${product.minCinPercent}-${product.maxCinPercent}% CNC`
                }
             </p>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 md:p-4 md:pt-0">
           <Button 
             className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white h-8 text-xs md:h-10 md:text-sm" 
             onClick={() => navigate(`/app/cinplace/${product.id}`)}
           >
             <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Detalhes
           </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
