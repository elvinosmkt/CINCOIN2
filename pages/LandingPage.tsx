
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe2, Users2, Zap, Landmark, ShoppingBag, BarChart3, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      
      {/* Navbar Transparente e Premium */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">C</div>
            <span className="text-xl font-bold tracking-tight">Cincoin<span className="text-primary">.asia</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#ecosystem" className="hover:text-primary transition-colors">Ecossistema</a>
            <a href="#cinplace" className="hover:text-primary transition-colors">CinPlace</a>
            <a href="#cinbank" className="hover:text-primary transition-colors">CinBank</a>
            <a href="#roadmap" className="hover:text-primary transition-colors">Roadmap</a>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="hidden md:flex" onClick={() => navigate('/login')}>Login</Button>
            <Button className="rounded-full px-6 shadow-lg shadow-primary/25" onClick={() => navigate('/login')}>
              Acessar Plataforma
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section Imersiva */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-md text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              O Utility Token Definitivo
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Conectando Cripto <br className="hidden md:block"/>
              ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">Mundo Real</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Uma plataforma completa que une marketplace híbrido, banco digital e exchange. 
              Use Cincoin para comprar, investir e transferir com a segurança da blockchain.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="h-12 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => navigate('/login')}>
                Criar Conta Grátis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-lg border-white/10 bg-white/5 backdrop-blur hover:bg-white/10">
                Ler Whitepaper
              </Button>
            </div>
          </motion.div>

          {/* Hero Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 md:mt-24 relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-white/10 bg-background/50 backdrop-blur-xl p-2 shadow-2xl">
              <div className="rounded-xl overflow-hidden border border-white/5 bg-background">
                 <img src="https://cdn.dribbble.com/userupload/12695662/file/original-b184275f963076136d80424a73383e20.png?resize=2048x1536" alt="Dashboard Preview" className="w-full h-auto opacity-90" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Market Cap", value: "$45M+" },
            { label: "Volume 24h", value: "$2.5M" },
            { label: "Holders", value: "14.2K" },
            { label: "Parceiros", value: "150+" },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* O Ecossistema (Cards Premium) */}
      <section id="ecosystem" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Um Ecossistema Integrado</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A Cincoin não é apenas uma moeda. É um conjunto de soluções financeiras e comerciais desenhadas para gerar valor real.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: CinPlace */}
            <motion.div whileHover={{ y: -10 }} className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 hover:border-primary/50 transition-colors overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                <ShoppingBag className="h-24 w-24 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center mb-6">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">CinPlace</h3>
                <p className="text-muted-foreground mb-6">
                  O primeiro marketplace híbrido. Compre produtos de grandes marcas pagando parte em Cincoin e parte em Fiat.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-gray-400">
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-orange-500" /> Split de Pagamento</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-orange-500" /> Cashback em CNC</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-orange-500" /> Vendedores Verificados</li>
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors border-white/10">Acessar Loja</Button>
              </div>
            </motion.div>

            {/* Card 2: CinBank */}
            <motion.div whileHover={{ y: -10 }} className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 hover:border-green-500/50 transition-colors overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                <Landmark className="h-24 w-24 text-green-500" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
                  <Landmark className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">CinBank</h3>
                <p className="text-muted-foreground mb-6">
                  Sua ponte para o sistema financeiro. Consórcios, investimentos CDI e cartão de crédito, tudo integrado.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-gray-400">
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-green-500" /> Rendimento Automático</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-green-500" /> Cartão Crypto-Fiat</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-green-500" /> Empréstimos Colateralizados</li>
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors border-white/10">Abrir Conta</Button>
              </div>
            </motion.div>

            {/* Card 3: CinExchange */}
            <motion.div whileHover={{ y: -10 }} className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 hover:border-blue-500/50 transition-colors overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                <BarChart3 className="h-24 w-24 text-blue-500" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">CinExchange</h3>
                <p className="text-muted-foreground mb-6">
                  Negocie seus ativos com liquidez e segurança. A corretora oficial do ecossistema com as menores taxas.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-gray-400">
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-blue-500" /> Taxa Zero para Holders</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-blue-500" /> Pair P2P Seguro</li>
                  <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-blue-500" /> Staking Integrado</li>
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors border-white/10">Negociar Agora</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6">
         <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 space-y-6">
               <h2 className="text-3xl md:text-5xl font-bold text-white">Comece a usar Cincoin hoje</h2>
               <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                 Junte-se a mais de 14.000 membros que já estão aproveitando o poder do utility token no dia a dia.
               </p>
               <Button size="lg" variant="secondary" className="h-14 px-10 rounded-full text-lg shadow-xl" onClick={() => navigate('/login')}>
                 Criar Carteira Grátis
               </Button>
            </div>
         </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="border-t border-white/5 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">C</div>
            <span className="text-lg font-bold">Cincoin</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Cincoin Foundation. Todos os direitos reservados.
          </div>
          <div className="flex gap-6 text-muted-foreground">
            <Globe2 className="h-5 w-5 hover:text-primary cursor-pointer" />
            <ShieldCheck className="h-5 w-5 hover:text-primary cursor-pointer" />
            <Users2 className="h-5 w-5 hover:text-primary cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
