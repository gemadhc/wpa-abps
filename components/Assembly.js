import AssemblyForm  from "../forms/Assembly"

export default function Assembly({device, onAssemblyChange}){
	return(
		<div className = "pb-50">

			<AssemblyForm 	
				device = {device}
				onAssemblyChange= {(updated)=> onAssemblyChange(updated)}
			/>
		</div>
	)
}