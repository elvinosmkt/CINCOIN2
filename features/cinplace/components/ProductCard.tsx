
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CinPlaceProduct } from '../../../types/cinplace';
import { Card, CardContent, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ShoppingBag, ArrowRightLeft } from 'lucide-react';
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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden flex flex-col h-full border-border/50 hover:shadow-xl hover:border-primary/30 transition-all">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted group cursor-pointer" onClick={() => navigate(`/app/cinplace/${product.id}`)}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute top-2 right-2">
            <span className="bg-background/80 backdrop-blur-md text-foreground text-xs font-semibold px-2 py-1 rounded-md border border-border">
              {product.category}
            </span>
          </div>
          <div className="absolute bottom-2 left-2">
             <CincoinBadge percentage={getAcceptanceLabel() || 0} />
             {product.acceptType === 'RANGE' && (
                <span className="ml-1 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Flexível</span>
             )}
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="font-bold text-lg leading-tight line-clamp-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground">{product.sellerName}</p>
             </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          
          <div className="mt-auto pt-2">
             <div className="text-lg font-bold text-foreground">
                {formatCurrency(product.priceFiat, 'BRL')}
             </div>
             <p className="text-xs text-muted-foreground">
                {product.acceptType === 'FIXED' 
                  ? `Aceita ${product.fixedCinPercent}% em CNC`
                  : `Aceita de ${product.minCinPercent}% a ${product.maxCinPercent}% CNC`
                }
             </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 gap-2">
           <Button 
             className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white" 
             onClick={() => navigate(`/app/cinplace/${product.id}`)}
           >
             <ShoppingBag className="h-4 w-4 mr-2" /> Detalhes
           </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
