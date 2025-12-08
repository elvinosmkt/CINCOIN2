import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Map as MapIcon, List, Search, MapPin, Filter, Navigation } from 'lucide-react';
import { COMPANIES } from '../../data/companies';
import { Company } from '../../types';
import { CincoinBadge } from '../../components/ui/CincoinBadge';
import L from 'leaflet';

const Cinbusca = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [minCincoin, setMinCincoin] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Filter Logic
  const filteredCompanies = COMPANIES.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSlider = company.percentCincoin >= minCincoin;
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    
    return matchesSearch && matchesSlider && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(COMPANIES.map(c => c.category)))];

  // Geolocation
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
       navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          if (mapRef.current) {
             mapRef.current.setView([latitude, longitude], 14);
             // Add user marker
             L.marker([latitude, longitude], {
                icon: L.divIcon({
                   className: 'bg-blue-500 rounded-full border-2 border-white shadow-lg',
                   iconSize: [16, 16]
                })
             }).addTo(mapRef.current).bindPopup("Você está aqui").openPopup();
          }
       });
    } else {
       alert("Geolocalização não suportada.");
    }
  };

  // Map Initialization
  useEffect(() => {
    if (viewMode === 'map' && !mapRef.current) {
      // Default center (Balneário Camboriú)
      const defaultCenter: [number, number] = [-26.9920, -48.6340];
      
      const map = L.map('cinbusca-map').setView(defaultCenter, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;
    }

    // Update markers when filteredCompanies changes
    if (viewMode === 'map' && mapRef.current) {
       // Clear existing markers
       markersRef.current.forEach(m => m.remove());
       markersRef.current = [];

       filteredCompanies.forEach(company => {
          // Custom Icon based on % (Opacity/Color logic visual simulation)
          const opacity = 0.6 + (company.percentCincoin / 100) * 0.4;
          
          const iconHtml = `
            <div class="relative group">
                <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white transform transition-transform group-hover:scale-125" style="opacity: ${opacity}">
                   C
                </div>
                ${company.percentCincoin === 100 ? '<div class="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full border border-white animate-pulse"></div>' : ''}
            </div>
          `;

          const customIcon = L.divIcon({
             html: iconHtml,
             className: '',
             iconSize: [32, 32],
             iconAnchor: [16, 32],
             popupAnchor: [0, -32]
          });

          const marker = L.marker([company.latitude, company.longitude], { icon: customIcon })
             .addTo(mapRef.current!)
             .bindPopup(`
                <div class="font-sans min-w-[200px]">
                   <div class="flex items-center gap-2 mb-2">
                       <img src="${company.image}" class="h-8 w-8 rounded-md object-cover" />
                       <div>
                           <h3 class="font-bold text-sm leading-none">${company.name}</h3>
                           <span class="text-[10px] text-gray-500 uppercase">${company.category}</span>
                       </div>
                   </div>
                   <div class="mb-2 text-xs text-gray-600">
                      ${company.address}
                   </div>
                   <div class="flex items-center gap-1 mb-3">
                      <span class="text-xs font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">Aceita ${company.percentCincoin}% CNC</span>
                   </div>
                   <button onclick="window.location.hash='#/app/cinplace?search=${encodeURIComponent(company.name)}'" class="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1.5 rounded transition-colors">
                      Ver Ofertas
                   </button>
                </div>
             `);
          
          markersRef.current.push(marker);
       });
    }

    return () => {
       // Cleanup map if unmounting or switching views (optional, but good practice if switching often)
       // Keeping map instance alive for performance if toggling view is frequent could be an option, but for now simple cleanup
       if (viewMode !== 'map' && mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
       }
    };
  }, [viewMode, filteredCompanies]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4 mb-4 z-10">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/80 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-sm">
            <div>
               <h1 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" /> Cinbusca
               </h1>
               <p className="text-xs text-muted-foreground">Encontre lugares que aceitam Cincoin.</p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
               <Button 
                 variant={viewMode === 'map' ? 'primary' : 'outline'} 
                 size="sm"
                 className="flex-1"
                 onClick={() => setViewMode('map')}
               >
                 <MapIcon className="h-4 w-4 mr-2" /> Mapa
               </Button>
               <Button 
                 variant={viewMode === 'list' ? 'primary' : 'outline'} 
                 size="sm"
                 className="flex-1"
                 onClick={() => setViewMode('list')}
               >
                 <List className="h-4 w-4 mr-2" /> Lista
               </Button>
               <Button
                 variant="secondary"
                 size="sm"
                 className="md:hidden"
                 onClick={() => navigate('/app/company-setup')}
               >
                 Sou Loja
               </Button>
            </div>
            <Button
                 className="hidden md:flex bg-orange-600 hover:bg-orange-700 text-white"
                 size="sm"
                 onClick={() => navigate('/app/company-setup')}
               >
                 Cadastrar meu Negócio
            </Button>
         </div>

         {/* Filters Bar */}
         <div className="flex flex-col md:flex-row gap-3 bg-card p-3 rounded-xl border border-border/50 shadow-sm overflow-x-auto">
            <div className="relative min-w-[200px] flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <input 
                  className="w-full bg-muted/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Buscar loja..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            
            <div className="flex items-center gap-2 min-w-[200px] bg-muted/50 px-3 rounded-lg">
               <span className="text-xs text-muted-foreground whitespace-nowrap">Mín. CNC:</span>
               <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={minCincoin} 
                  onChange={(e) => setMinCincoin(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
               />
               <span className="text-xs font-bold w-8 text-right">{minCincoin}%</span>
            </div>

            <select 
               className="bg-muted/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
            >
               <option value="all">Todas Categorias</option>
               {categories.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c}</option>
               ))}
            </select>

            <Button size="sm" variant="outline" onClick={handleLocateMe} title="Minha Localização">
               <Navigation className="h-4 w-4" />
            </Button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-border/50 bg-muted/20">
         
         {/* MAP VIEW */}
         <div id="cinbusca-map" className={`w-full h-full ${viewMode === 'map' ? 'block' : 'hidden'} z-0`} />

         {/* LIST VIEW */}
         {viewMode === 'list' && (
            <div className="h-full overflow-y-auto p-4">
               {filteredCompanies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                     <Search className="h-12 w-12 mb-4 opacity-20" />
                     <p>Nenhuma loja encontrada.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredCompanies.map(company => (
                        <Card key={company.id} className="hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => navigate(`/app/cinplace?search=${company.name}`)}>
                           <div className="flex items-start p-4 gap-4">
                              <img src={company.image} alt={company.name} className="h-16 w-16 rounded-lg object-cover bg-muted" />
                              <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-start">
                                    <h3 className="font-bold truncate pr-2">{company.name}</h3>
                                    <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">{company.category}</span>
                                 </div>
                                 <p className="text-xs text-muted-foreground truncate">{company.address}</p>
                                 <div className="flex items-center gap-2 mt-2">
                                    <CincoinBadge percentage={company.percentCincoin} />
                                 </div>
                              </div>
                           </div>
                           <div className="bg-muted/30 px-4 py-2 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">⭐ {company.rating} ({company.totalReviews})</span>
                              <span className="group-hover:text-primary font-medium transition-colors">Ver Loja →</span>
                           </div>
                        </Card>
                     ))}
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};

export default Cinbusca;
