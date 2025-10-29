import AssemblyForm  from "../forms/Assembly"

export default function Assembly({device}){
	return(
		<div>

			<AssemblyForm 	
				device = {device}
			/>
			<div></div>
		</div>
	)
}