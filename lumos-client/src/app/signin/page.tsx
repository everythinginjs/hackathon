import { redirect } from 'next/navigation';
import { getCurrentUser, getEmailFromExpiredToken } from '../../lib/auth/actions';
import SigninForm from './components/SigninForm';
import { AnimatedBackground } from '../components/AnimatedBackground';

interface SigninPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SigninPage({ searchParams }: SigninPageProps) {
  // Check if user is already authenticated
  const user = await getCurrentUser();

  if (user) {
    // User is already logged in, redirect them
    const params = await searchParams;
    const callbackUrl = params.callbackUrl || '/';
    redirect(callbackUrl);
  }

  const prefilledEmail = await getEmailFromExpiredToken();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 overflow-hidden">
      <AnimatedBackground />
      <div className="relative">
        <SigninForm prefilledEmail={prefilledEmail} />
      </div>
    </div>
  );
}
