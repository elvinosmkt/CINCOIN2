
import React, { useState } from 'react';
import { useCinPlaceProducts } from '../../../hooks/useCinPlace';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Search, Filter, SlidersHorizontal, AlertTriangle, Store } from 'lucide-react';
import { CATEGORIES } from '../../../types/cinplace';

export const CinPlaceListPage = () => {
  const { data: products, isLoading } = useCinPlaceProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [minCinPercent, setMinCinPercent] = useState(0);

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    
    // Check if product supports at least the minCinPercent
    const productMaxPercent = p.acceptType === 'FIXED' ? p.fixedCinPercent! : p.maxCinPercent!;
    const matchesPercent = productMaxPercent >= minCinPercent;

    return matchesSearch && matchesCategory && matchesPercent;
  });

  return (
    <div className="space-y-4 md:space-y-6 pb-20">
      {/* Header Compacto Mobile */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-yellow-600 to-amber-600 h-40 md:h-64 flex items-center px-6 md:px-16 shadow-xl">
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
        <div className="relative z-10 max-w-2xl">
           <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4">
             CinPlace <span className="font-light text-yellow-200">Market</span>
           </h1>
           <p className="text-yellow-50 text-xs md:text-lg max-w-lg leading-relaxed">
             O marketplace onde você decide o quanto paga em Crypto e Fiat.
           </p>
        </div>
      </div>

      {/* Filters Sticky & Compact */}
      <div className="bg-card border border-border/50 rounded-xl p-3 shadow-lg sticky top-2 z-20 space-y-3 md:space-y-0 md:flex gap-4 items-end">
         <div className="flex-1 space-y-1">
            <label className="hidden md:block text-xs text-muted-foreground ml-1">Buscar</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                <Input 
                   placeholder="Buscar produtos..." 
                   className="pl-8 h-9 text-xs md:text-sm"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
         </div>
         
         <div className="grid grid-cols-2 gap-2 md:flex md:w-auto">
             <div className="w-full md:w-48 space-y-1">
                 <label className="hidden md:block text-xs text-muted-foreground ml-1">Categoria</label>
                 <select 
                    className="w-full h-9 bg-background border border-input rounded-md px-2 text-xs md:text-sm focus:ring-2 focus:ring-primary"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                 >
                    <option value="Todas">Todas</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
             </div>

             <div className="w-full md:w-64 space-y-1 bg-muted/30 rounded-md border border-input px-2 flex flex-col justify-center h-9">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] md:text-xs text-muted-foreground">Mín. CNC</label>
                    <span className="text-[10px] md:text-xs font-bold text-primary">{minCinPercent}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={minCinPercent}
                    onChange={(e) => setMinCinPercent(Number(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                 />
             </div>
         </div>
         
         <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => {
             setSearchTerm(''); setSelectedCategory('Todas'); setMinCinPercent(0);
         }}>
             Limpar
         </Button>
      </div>

      {/* Grid Otimizado para Mobile (2 colunas) */}
      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">Carregando catálogo...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts?.length === 0 && (
             <div className="col-span-full text-center py-20 text-muted-foreground">
                Nenhum produto encontrado com esses filtros.
             </div>
          )}
          {filteredProducts?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
