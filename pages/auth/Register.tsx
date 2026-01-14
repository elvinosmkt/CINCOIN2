
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card';
import { Globe2, ArrowLeft, Store, User } from 'lucide-react';

// Schema Base
const baseSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "Você deve aceitar os termos")
});

// Schema Usuário
const userSchema = baseSchema.extend({
  type: z.literal('user'),
  name: z.string().min(3, 'Nome inválido'),
  phone: z.string().min(8, 'Telefone inválido'),
  countryCode: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

// Schema Parceiro
const partnerSchema = baseSchema.extend({
  type: z.literal('company'),
  // Dados da empresa
  companyName: z.string().min(3, "Razão Social/Fantasia obrigatória"),
  description: z.string().min(10, "Descrição curta obrigatória"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  whatsapp: z.string().min(10, "WhatsApp obrigatório"),
  // Endereço
  cep: z.string().min(8, "CEP inválido"),
  state: z.string().min(2, "UF inválida"),
  city: z.string().min(2, "Cidade obrigatória"),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  address: z.string().min(5, "Rua obrigatória"),
  addressNumber: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  reference: z.string().optional(),
  // Localização
  lat: z.string().optional(),
  lng: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'partner' ? 'company' : 'user';
  const [activeTab, setActiveTab] = useState<'user' | 'company'>(initialType);
  const loginToStore = useAuthStore((state) => state.login);
  
  // Como temos schemas diferentes, usamos um genérico ou any aqui para simplificar a demo, 
  // mas na prática poderiamos ter dois forms separados.
  const { register, handleSubmit, formState: { errors }, watch } = useForm<any>({
    resolver: zodResolver(activeTab === 'user' ? userSchema : partnerSchema),
    defaultValues: {
      type: activeTab,
      countryCode: '+55'
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.auth.register(data),
    onSuccess: (user) => {
      loginToStore(user, 'fake-jwt-token');
      if (activeTab === 'company') {
        alert("Cadastro de parceiro realizado! Sua loja está em análise.");
        navigate('/app/company-setup'); // Vai para setup para terminar de configurar se quiser
      } else {
        navigate('/app/dashboard');
      }
    },
    onError: (error: Error) => {
      console.error(error);
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate({ ...data, type: activeTab });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-2xl animate-in fade-in zoom-in duration-300 shadow-2xl border-primary/10">
        <CardHeader className="space-y-1">
          <Button variant="ghost" className="w-fit p-0 h-auto mb-2 text-muted-foreground hover:text-foreground" onClick={() => navigate('/login')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
              <CardDescription>Escolha seu perfil para começar.</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
               <Globe2 className="h-5 w-5" />
            </div>
          </div>
          
          {/* Tabs Type Selector */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-muted rounded-lg">
             <button 
                type="button"
                onClick={() => setActiveTab('user')}
                className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'user' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
             >
                <User className="h-4 w-4" /> Sou Usuário
             </button>
             <button 
                type="button"
                onClick={() => setActiveTab('company')}
                className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'company' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
             >
                <Store className="h-4 w-4" /> Sou Parceiro
             </button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {activeTab === 'user' ? (
                // FORMULARIO USUARIO
                <>
                    <Input label="Nome Completo" placeholder="Seu nome" error={errors.name?.message} {...register('name')} />
                    <Input label="E-mail" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Telefone</label>
                        <div className="flex gap-2">
                            <select className="w-[80px] h-10 rounded-md border bg-background px-2 text-sm" {...register('countryCode')}>
                                <option value="+55">+55</option>
                            </select>
                            <Input placeholder="99999-9999" error={errors.phone?.message} className="mt-0" {...register('phone')} />
                        </div>
                    </div>
                </>
            ) : (
                // FORMULARIO PARCEIRO
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                        <h4 className="font-bold text-sm text-primary mb-2 border-b pb-1">Dados da Empresa</h4>
                    </div>
                    <div className="col-span-full md:col-span-1">
                        <Input label="Nome da Loja (Fantasia)" placeholder="Ex: Café Central" error={errors.companyName?.message} {...register('companyName')} />
                    </div>
                    <div className="col-span-full md:col-span-1">
                        <Input label="CNPJ" placeholder="00.000.000/0001-00" error={errors.cnpj?.message} {...register('cnpj')} />
                    </div>
                    <div className="col-span-full">
                        <Input label="Descrição Curta" placeholder="Ex: O melhor café da cidade..." error={errors.description?.message} {...register('description')} />
                    </div>
                    <div className="col-span-full md:col-span-1">
                        <Input label="WhatsApp Contato" placeholder="(00) 00000-0000" error={errors.whatsapp?.message} {...register('whatsapp')} />
                    </div>

                    <div className="col-span-full mt-2">
                        <h4 className="font-bold text-sm text-primary mb-2 border-b pb-1">Endereço & Localização</h4>
                    </div>
                    <Input label="CEP" placeholder="00000-000" error={errors.cep?.message} {...register('cep')} />
                    <Input label="Cidade" placeholder="Cidade" error={errors.city?.message} {...register('city')} />
                    <Input label="Estado" placeholder="UF" error={errors.state?.message} {...register('state')} />
                    <Input label="Bairro" placeholder="Bairro" error={errors.neighborhood?.message} {...register('neighborhood')} />
                    <div className="col-span-full">
                         <Input label="Endereço (Rua/Av)" placeholder="Logradouro" error={errors.address?.message} {...register('address')} />
                    </div>
                    <Input label="Número" placeholder="123" error={errors.addressNumber?.message} {...register('addressNumber')} />
                    <Input label="Complemento" placeholder="Sala 1, Apto 2..." {...register('complement')} />
                    <div className="col-span-full">
                        <Input label="Ponto de Referência" placeholder="Próximo ao..." {...register('reference')} />
                    </div>
                    
                    {/* Campos ocultos ou manuais de Lat/Long para simplicidade */}
                    <input type="hidden" {...register('lat')} value="-26.9920" />
                    <input type="hidden" {...register('lng')} value="-48.6340" />

                    <div className="col-span-full mt-2">
                        <h4 className="font-bold text-sm text-primary mb-2 border-b pb-1">Acesso à Plataforma</h4>
                    </div>
                     <div className="col-span-full">
                        <Input label="E-mail de Acesso" type="email" error={errors.email?.message} {...register('email')} />
                    </div>
                </div>
            )}

            {/* Senhas (Comum a ambos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Senha" type="password" error={errors.password?.message} {...register('password')} />
                <Input label="Confirmar Senha" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            </div>

            {/* Termos */}
            <label className="flex items-start gap-2 text-sm text-muted-foreground mt-4 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded border-primary accent-primary" {...register('terms')} />
                <span>Concordo com os Termos de Adesão da Cincoin e Política de Privacidade.</span>
            </label>
            {errors.terms && <p className="text-xs text-destructive">{errors.terms.message as string}</p>}

            <Button type="submit" className="w-full h-12 text-lg font-bold mt-4" isLoading={mutation.isPending}>
              {activeTab === 'user' ? 'Criar Conta Pessoal' : 'Cadastrar Minha Loja'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <div className="text-sm text-muted-foreground">
            Já possui cadastro? <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline">Faça Login</button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
