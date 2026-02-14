import { SearchSection } from './components/SearchSection';
import { Navbar } from './components/Navbar';
import { AnimatedBackground } from './components/AnimatedBackground';

export default function Index() {
  return (
    <main className="relative min-h-screen w-full bg-background overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <SearchSection />
      </div>
    </main>
  );
}
