'use client'
import { useRouter, usePathname } from 'next/navigation';
import { Home, Layers, LogOut } from 'lucide-react';
import { SessionProvider, useSession } from '../helpers/session';
import { useEffect, useState} from 'react';
import { logout } from '../actions/session';

export default function Footer(){
	const router = useRouter();
	const pathname = usePathname();
	const [show, setShow] = useState(false)

	const { session, setSession } = useSession();
	const handleDispatch = () => router.push('/offline');
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
	    if (!session) router.push('/login');
	 }, [session, router]);


	useEffect(()=>{
		console.log("This is the pathname: ", pathname, pathname.includes('/offline'))
		if( pathname.includes('/offline') || pathname.includes('/stop') || pathname.includes('/more') ){
			setShow(true)
		}else{
			setShow(false)
		}
	}, [pathname])

	const isActive = (path) => pathname.startsWith(path);

	return(
		<div>{
			show ?
				<div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-100 border-t border-gray-200 flex justify-around items-center h-25 shadow-md">
					<button
					onClick={handleDispatch}
					className={`flex flex-col items-center justify-center h-full w-full px-4 py-1 rounded-md transition ${
					  isActive('/offline')
					    ? 'bg-slate-200 text-pink-700'
					    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
					}`}
					>
					<Home className="w-5 h-5 mb-0.5" />
					<span className="text-xs font-medium">Dispatch</span>
					</button>

					<button
					onClick={handleMore}
					className={`flex flex-col items-center justify-center h-full w-full px-4 py-1 rounded-md transition ${
					  isActive('/more')
					    ? 'bg-slate-200 text-pink-700'
					    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
					}`}
					>
					<Layers className="w-5 h-5 mb-0.5" />
					<span className="text-xs font-medium">More</span>
					</button>

					<button
					onClick={handleLogout}
					className="flex flex-col items-center justify-center  h-full w-full  px-4 py-1 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 transition"
					>
					<LogOut className="w-5 h-5 mb-0.5" />
					<span className="text-xs font-medium">Logout</span>
					</button>

				</div>
			: 
				<div> 

				</div>
				
		}</div>		
	) 
}