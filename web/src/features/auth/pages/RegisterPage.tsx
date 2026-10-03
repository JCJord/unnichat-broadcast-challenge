import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Radio, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/core/auth/useAuth';
import { registerSchema, RegisterFormData, getAuthErrorMessage } from '../schemas/authSchemas';
import { Button, Input } from '@/shared/components/ui';

export const RegisterPage: React.FC = () => {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    try {
      await signUp(data.email, data.password);
      navigate('/connections');
    } catch (err: unknown) {
      const error = err as { code?: string };
      setAuthError(getAuthErrorMessage(error.code || ''));
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col gap-y-6">
        <div className="flex flex-col items-center text-center gap-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-xs shadow-primary/20 mb-1">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Criar conta
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Plataforma de Broadcast
          </p>
        </div>

        {authError && (
          <div className="p-3.5 rounded-xl bg-status-error/10 border border-status-error/30 flex items-start gap-2.5 text-status-error text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo de 6 caracteres"
            autoComplete="new-password"
            leftIcon={<Lock size={16} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="Repita sua senha"
            autoComplete="new-password"
            leftIcon={<Lock size={16} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="solid"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              Cadastrar
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-dark-border text-center text-xs text-text-secondary">
          <span>Já possui uma conta? </span>
          <Link
            to="/login"
            className="text-primary hover:text-primary-hover font-medium underline underline-offset-4 ml-1 transition-colors"
          >
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
};
