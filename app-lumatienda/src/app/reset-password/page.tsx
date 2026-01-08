// src/app/reset-password/page.tsx
import { Suspense } from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}