'use client'
import { useRouter, usePathname } from 'next/navigation';
import { Home, Layers, LogOut } from 'lucide-react';
import { useSession } from '../helpers/session';
import { useEffect, useState } from 'react';
import { logout } from '../actions/session';
import { useView } from '@/contexts/ViewContext';

export default function Footer(){
	const router = useRouter();
	const pathname = usePathname();
	const [show, setShow] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const { view } = useView();
	const { session, setSession, loading } = useSession();

	const handleDispatch = () => {
		if (isLoggingOut) return;
		router.push('/');
	};

	const handleMore = () => {
		if (isLoggingOut) return;
		router.push('/more');
	};

	const handleLogout = async () => {
		if (isLoggingOut) return; // 🚫 prevent double click

		try {
			setIsLoggingOut(true);
			await logout();
			localStorage.removeItem('session');
			setSession(null);
			setIsLoggingOut(false);
			router.push('/login');

		} catch (err) {
			console.error('Logout error:', err);
			setIsLoggingOut(false); // allow retry if failed
		}
	}

	useEffect(() => {
		if(loading) return
			
		if (!session) router.push('/login');
	}, [session, router, loading]);


	useEffect(()=>{
		if (pathname.includes('/login') || pathname.includes('/reset')) {
			setShow(false);
		} else {
			setShow(true);
		}
	}, [pathname]);

	const isActive = (path: string) => pathname === path;

	const hideFooter = view.type === 'stop' || view.type === 'report';

	return (
		<div>
			{!hideFooter && show && (
				<div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-100 border-t border-gray-200 flex justify-around items-center h-25 shadow-md">

					{/* Dispatch */}
					<button
						onClick={handleDispatch}
						disabled={isLoggingOut}
						className={`flex flex-col items-center justify-center h-full w-full px-4 py-1 rounded-md transition ${
							isActive('/')
								? 'bg-slate-200 text-pink-700'
								: 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
						} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						<Home className="w-5 h-5 mb-0.5" />
						<span className="text-xs font-medium">Dispatch</span>
					</button>

					{/* More */}
					<button
						onClick={handleMore}
						disabled={isLoggingOut}
						className={`flex flex-col items-center justify-center h-full w-full px-4 py-1 rounded-md transition ${
							isActive('/more')
								? 'bg-slate-200 text-pink-700'
								: 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
						} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						<Layers className="w-5 h-5 mb-0.5" />
						<span className="text-xs font-medium">More</span>
					</button>

					{/* Logout */}
					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className={`flex flex-col items-center justify-center h-full w-full px-4 py-1 rounded-md transition ${
							isLoggingOut
								? 'text-gray-400 cursor-not-allowed'
								: 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
						}`}
					>
						{isLoggingOut ? (
							<>
								{/* simple spinner */}
								<div className="w-5 h-5 mb-0.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
								<span className="text-xs font-medium">Logging out...</span>
							</>
						) : (
							<>
								<LogOut className="w-5 h-5 mb-0.5" />
								<span className="text-xs font-medium">Logout</span>
							</>
						)}
					</button>

				</div>
			)}
		</div>
	);
}