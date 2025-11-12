'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Home, Layers, LogOut } from 'lucide-react';
import './globals.css';
import { SessionProvider, useSession } from '../helpers/session';
import { logout } from '../actions/session';

function LayoutContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, setSession} = useSession();

  const handleDispatch = () => router.push('/dispatch');
  const handleMore = () => router.push('/more');

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('session');
      setSession(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  const isActive = (path) => pathname.startsWith(path);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-slate-100 border-b border-gray-200 flex items-center justify-center shadow-sm font-semibold text-sm sm:text-base text-slate-900">
        American Backflow & Plumbing Services, Inc.
      </header>

      {/* MAIN */}
      <main className="flex-1 mt-12 mb-20 overflow-y-auto bg-gray-50 p-0">
        {children}
      </main>

      {/* FOOTER */}
      {session && (
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-100 border-t border-gray-200 flex justify-around items-center h-16 shadow-md">
          <button
            onClick={handleDispatch}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-md transition ${
              isActive('/dispatch')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-medium">Dispatch</span>
          </button>

          <button
            onClick={handleMore}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-md transition ${
              isActive('/more')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-medium">More</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center px-4 py-1 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 transition"
          >
            <LogOut className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </footer>
      )}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white text-gray-800 overflow-hidden">
        <SessionProvider>
          <LayoutContent>{children}</LayoutContent>
        </SessionProvider>
      </body>
    </html>
  );
}
