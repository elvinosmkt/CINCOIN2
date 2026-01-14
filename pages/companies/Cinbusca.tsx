
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Map as MapIcon, List, Search, MapPin, Navigation } from 'lucide-react';
import { useAllSellers } from '../../hooks/useCinPlace'; // Usando hook unificado
import { CincoinBadge } from '../../components/ui/CincoinBadge';
import L from 'leaflet';

const Cinbusca = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Use data from CinPlace service to align both features
  const { data: sellers, isLoading } = useAllSellers();
  
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Filter Logic
  const filteredSellers = sellers?.filter(seller => {
    // Basic filtering since SellerProfile doesn't have category explicitly in this mock version, 
    // we search by name/desc
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          seller.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  // Geolocation
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
       navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          if (mapRef.current) {
             mapRef.current.setView([latitude, longitude], 14);
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

    // Update markers when filteredSellers changes
    if (viewMode === 'map' && mapRef.current && sellers) {
       // Clear existing markers
       markersRef.current.forEach(m => m.remove());
       markersRef.current = [];

       filteredSellers.forEach(seller => {
          const iconHtml = `
            <div class="relative group">
                <div class="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white transform transition-transform group-hover:scale-125">
                   C
                </div>
            </div>
          `;

          const customIcon = L.divIcon({
             html: iconHtml,
             className: '',
             iconSize: [32, 32],
             iconAnchor: [16, 32],
             popupAnchor: [0, -32]
          });

          const marker = L.marker([seller.latitude, seller.longitude], { icon: customIcon })
             .addTo(mapRef.current!)
             .bindPopup(`
                <div class="font-sans min-w-[200px]">
                   <div class="flex items-center gap-2 mb-2">
                       <img src="${seller.imageUrl}" class="h-8 w-8 rounded-md object-cover" />
                       <div>
                           <h3 class="font-bold text-sm leading-none">${seller.name}</h3>
                       </div>
                   </div>
                   <div class="mb-2 text-xs text-gray-600">
                      ${seller.address}
                   </div>
                   <button onclick="window.location.hash='#/app/cinplace/seller/${seller.id}'" class="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-1.5 rounded transition-colors">
                      Ver Loja
                   </button>
                </div>
             `);
          
          markersRef.current.push(marker);
       });
    }

    return () => {
       if (viewMode !== 'map' && mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
       }
    };
  }, [viewMode, filteredSellers, sellers]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4 mb-4 z-10">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/80 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-sm">
            <div>
               <h1 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" /> Cinbusca
               </h1>
               <p className="text-xs text-muted-foreground">Encontre todas as lojas do CinPlace no mapa.</p>
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
            
            <Button size="sm" variant="outline" onClick={handleLocateMe} title="Minha Localização">
               <Navigation className="h-4 w-4" /> Localizar-me
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
               {isLoading && <div className="text-center p-4">Carregando mapa...</div>}
               {!isLoading && filteredSellers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                     <Search className="h-12 w-12 mb-4 opacity-20" />
                     <p>Nenhuma loja encontrada.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredSellers.map(seller => (
                        <Card key={seller.id} className="hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => navigate(`/app/cinplace/seller/${seller.id}`)}>
                           <div className="flex items-start p-4 gap-4">
                              <img src={seller.imageUrl} alt={seller.name} className="h-16 w-16 rounded-lg object-cover bg-muted" />
                              <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-start">
                                    <h3 className="font-bold truncate pr-2">{seller.name}</h3>
                                 </div>
                                 <p className="text-xs text-muted-foreground truncate">{seller.address}</p>
                                 <div className="flex items-center gap-2 mt-2">
                                     <span className="flex items-center text-xs text-yellow-600"><span className="mr-1">⭐</span> {seller.rating.toFixed(1)}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-muted/30 px-4 py-2 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                              <span className="group-hover:text-primary font-medium transition-colors">Visitar Loja →</span>
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
