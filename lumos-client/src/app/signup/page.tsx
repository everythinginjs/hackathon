import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib/auth/actions';
import { AnimatedBackground } from '../components/AnimatedBackground';
import SignupForm from './components/SignupForm';

interface SignupPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  // Check if user is already authenticated
  const user = await getCurrentUser();

  if (user) {
    // User is already logged in, redirect them
    const params = await searchParams;
    const callbackUrl = params.callbackUrl || '/';
    redirect(callbackUrl);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 overflow-hidden">
      <AnimatedBackground />
      <SignupForm />
    </div>
  );
}
