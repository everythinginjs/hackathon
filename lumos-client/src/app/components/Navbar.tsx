'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@org/ui-components';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { useTheme } from '@org/theme-mode';
import { logout } from '../../lib/auth/actions';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
}

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
      setShowUserMenu(false);
      router.push('/');
      router.refresh();
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xl font-bold">L</span>
          </div>
          <span className="text-xl font-bold text-primary">Lumos</span>
        </Link>

        {/* Auth Buttons and Theme Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="w-4 h-4 mr-2" />
                {user.email}
              </Button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        Signed in as
                        <div className="font-medium text-foreground truncate">
                          {user.email}
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isPending}
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent text-destructive disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {isPending ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
