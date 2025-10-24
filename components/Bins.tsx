export default function Bins({list}){
	return(
		<div className = "p-0 flex flex-row gap-2 overflow-x-scroll">
			{
				list.map((item, ind) =>{
					return(
						<div className = "p-1 bg-slate-100 text-black rounded-xl text-nowrap">
							{item.bin_num}
						</div>
					)
				})
			}
		</div>
	)
}