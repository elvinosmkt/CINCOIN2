
import React, { useState } from 'react';
import { useCinPlaceProducts } from '../../../hooks/useCinPlace';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 h-64 flex items-center px-8 md:px-16 shadow-2xl">
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
        <div className="relative z-10 max-w-2xl">
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
             CinPlace <span className="font-light text-orange-200">Market</span>
           </h1>
           <p className="text-orange-50 text-lg max-w-lg">
             O único marketplace onde você decide o quanto paga em Crypto e o quanto paga em Fiat.
           </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/50 rounded-xl p-4 shadow-lg sticky top-4 z-20 space-y-4 md:space-y-0 md:flex gap-4 items-end">
         <div className="flex-1 space-y-1">
            <label className="text-xs text-muted-foreground ml-1">Buscar</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                   placeholder="Nome do produto..." 
                   className="pl-9"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
         </div>
         
         <div className="w-full md:w-48 space-y-1">
             <label className="text-xs text-muted-foreground ml-1">Categoria</label>
             <select 
                className="w-full h-10 bg-background border border-input rounded-md px-3 text-sm focus:ring-2 focus:ring-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
             >
                <option value="Todas">Todas</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
         </div>

         <div className="w-full md:w-64 space-y-1">
             <div className="flex justify-between">
                <label className="text-xs text-muted-foreground ml-1">Aceitação Mínima (CNC)</label>
                <span className="text-xs font-bold text-primary">{minCinPercent}%</span>
             </div>
             <input 
                type="range" 
                min="0" 
                max="100" 
                value={minCinPercent}
                onChange={(e) => setMinCinPercent(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
             />
         </div>
         
         <Button variant="outline" className="hidden md:flex" onClick={() => {
             setSearchTerm(''); setSelectedCategory('Todas'); setMinCinPercent(0);
         }}>
             Limpar
         </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">Carregando catálogo...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
