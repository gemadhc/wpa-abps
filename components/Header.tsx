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
				<div className="flex flex-row gap-2 justify-end">
		          <p className="companyName text-xs">American Backflow &<br/> Plumbing Services, Inc.</p>
		          <OnlineChecker />
		        </div>

		}
		</>
		
	)
}