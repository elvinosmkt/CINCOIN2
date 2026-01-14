
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useStore';
import { 
  LayoutDashboard, 
  Wallet, 
  ShoppingBag, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  Landmark,
  ArrowRightLeft,
  MapPin,
  Settings,
  Package,
  MessageSquareText,
  ShieldAlert,
  Users,
  Building2,
  Cpu,
  Gift
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user, theme, toggleTheme } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User Navigation
  const userNavItems = [
    { label: 'Visão Geral', icon: LayoutDashboard, href: '/app/dashboard' },
    { label: 'Carteira', icon: Wallet, href: '/app/wallet' },
    { label: 'CinExchange', icon: ArrowRightLeft, href: '/app/exchange' },
    { label: 'CinPlace', icon: ShoppingBag, href: '/app/cinplace' },
    { label: 'Cinbusca', icon: MapPin, href: '/app/companies' }, 
    { label: 'CinBank', icon: Landmark, href: '/app/cinbank' },
    { label: 'Transparência', icon: BarChart3, href: '/app/transparency' },
  ];

  const businessItems = [
     { label: 'Config. Negócio', icon: Settings, href: '/app/company-setup' },
     { label: 'Meus Produtos', icon: Package, href: '/app/companies/cinplace/products' },
     { label: 'Negociações', icon: MessageSquareText, href: '/app/companies/cinplace/negotiations' },
  ];

  // Admin Navigation
  const adminNavItems = [
    { label: 'Admin Dashboard', icon: LayoutDashboard, href: '/app/admin' },
    { label: 'Validar Parceiros', icon: Building2, href: '/app/admin/companies' },
    { label: 'Gestão Exchange', icon: ArrowRightLeft, href: '/app/admin/exchange' },
    { label: 'Usuários', icon: Users, href: '/app/admin/users' },
    { label: 'Comissões & Afiliados', icon: Gift, href: '/app/admin/commissions' },
    { label: 'CinBank WL', icon: Cpu, href: '/app/admin/cinbank-wl' }, // White Label
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border/40 bg-card/80 backdrop-blur-xl transition-transform duration-300 ease-out md:static md:translate-x-0 shadow-2xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-lg ${user?.role === 'admin' ? 'bg-red-600 shadow-red-500/20' : 'bg-gradient-to-tr from-primary to-amber-500 shadow-primary/20'}`}>
              <span className="text-xl">C</span>
            </div>
            <div className="flex flex-col">
               <span className="text-lg font-bold tracking-tight">Cincoin</span>
               <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  {user?.role === 'admin' ? 'Admin Panel' : 'Platform'}
               </span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100%-5rem)] p-4 overflow-y-auto">
          <div className="space-y-6">
            <nav className="space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/app/admin' || item.href === '/app/dashboard'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {user?.role !== 'admin' && (
                <div className="pt-2 border-t border-border/30">
                <span className="px-3 text-xs font-semibold text-muted-foreground mb-2 block uppercase">Área do Parceiro</span>
                <nav className="space-y-1.5">
                    {businessItems.map((item) => (
                        <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => cn(
                            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive 
                            ? "bg-accent text-accent-foreground border border-border" 
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                        >
                        <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        {item.label}
                        </NavLink>
                    ))}
                </nav>
                </div>
            )}
          </div>

          <div className="space-y-4 mt-6">
            {user?.role === 'admin' ? (
                 <div className="rounded-xl bg-red-950/30 p-4 text-red-200 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">Acesso Admin</span>
                    </div>
                    <p className="text-xs opacity-70">Privilégios elevados ativos.</p>
                </div>
            ) : (
                <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-inner border border-white/5">
                    <p className="text-xs text-slate-400 mb-1">Saldo Estimado</p>
                    <p className="text-lg font-bold">R$ {user?.balance ? (user.balance * 0.50).toLocaleString('pt-BR') : '0,00'}</p>
                </div>
            )}

            <div className="border-t border-border/40 pt-4">
              <div className="flex items-center justify-between px-2 mb-3">
                 <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                      {user?.name.charAt(0)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                       <span className="text-sm font-medium truncate w-24">{user?.name}</span>
                    </div>
                 </div>
                 <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 w-8 rounded-full">
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                 </Button>
              </div>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Encerrar Sessão
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <header className="flex h-16 items-center border-b border-border/40 bg-background/80 backdrop-blur-md px-6 md:hidden sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-4 text-lg font-semibold">Cincoin</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
