import { SearchSection } from './components/SearchSection';
import { Navbar } from './components/Navbar';

export default function Index() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <SearchSection />
      </div>
    </main>
  );
}
