import { SearchSection } from './components/SearchSection';
import { Navbar } from './components/Navbar';
import { AnimatedBackground } from './components/AnimatedBackground';
import { getCurrentUser } from '../lib/auth/actions';

export default async function Index() {
  const user = await getCurrentUser();

  return (
    <main className="relative min-h-screen w-full bg-background overflow-hidden">
      <AnimatedBackground />
      <Navbar user={user} />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <SearchSection />
      </div>
    </main>
  );
}
