import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const loginToStore = useAuthStore((state) => state.login);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormValues) => api.auth.login(data.email, data.password),
    onSuccess: (user) => {
      loginToStore(user, 'fake-jwt-token');
      navigate('/app/dashboard');
    },
    onError: (error: Error) => {
      console.error(error);
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-center">Digite seu e-mail para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              label="E-mail" 
              type="email" 
              placeholder="m@exemplo.com" 
              error={errors.email?.message}
              {...register('email')}
            />
            <Input 
              label="Senha" 
              type="password" 
              error={errors.password?.message}
              {...register('password')}
            />
            
            {mutation.isError && (
              <div className="p-3 rounded bg-destructive/10 text-destructive text-sm text-center">
                E-mail ou senha inválidos.
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={mutation.isPending}>
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Não tem uma conta? <span className="text-primary cursor-pointer hover:underline">Cadastre-se</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            (Demo: use qualquer e-mail, senha > 6 caracteres)
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;