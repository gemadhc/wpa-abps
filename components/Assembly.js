import AssemblyForm  from "../forms/Assembly"

export default function Assembly({device, onAssemblyChange}){
	return(
		<div>

			<AssemblyForm 	
				device = {device}
				onAssemblyChange= {(updated)=> onAssemblyChange(updated)}
			/>
			<div></div>
		</div>
	)
}