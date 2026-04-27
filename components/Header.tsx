'use client'
import OnlineChecker from "@/components/OnlineChecker";
import { useView } from '@/contexts/ViewContext';


export default function Home(){
	const { view } = useView();
	const hideHeader = view.type === 'stop' || view.type === 'report';
	return(
		<> {
			hideHeader ?
				<></>
			: 
				<header className="fixed top-0 left-0 right-0 z-50 h-13 py-2 pr-5 bg-slate-800 text-white ">
				<div className="flex flex-row gap-2 justify-end">
		          <p className="companyName text-xs">American Backflow &<br/> Plumbing Services, Inc.</p>
		          <OnlineChecker />
		        </div>
		        </header>

		}
		</>
		
	)
}