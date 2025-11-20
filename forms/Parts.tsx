import FormLayout from "../layouts/FormLayout"

export default function Parts(){
	const fields = [ 
		{ name: 'disc', label: 'Disc',  type:"checkbox" },
		{ name: 'o_ring', label: 'O-Ring',  type:"checkbox" },
		{ name: 'check_disc', label: 'Check Disc',  type:"checkbox" },
		{ name: 'spring', label: 'Spring',  type:"checkbox" },
		{ name: 'rubber_kit', label: 'Rubber Kit',  type:"checkbox" },
		{ name: 'check_spring', label: 'Check Spring',  type:"checkbox" },
		{ name: 'guide', label: 'Guide',  type:"checkbox" },
		{ name: 'diaphragm', label: 'Diaphragm',  type:"checkbox" },
		{ name: 'ff', label: 'Float',  type:"checkbox" },
		{ name: 'seat', label: 'Seat',  type:"checkbox" },
		{ name: 'air_spring', label: 'Air Spring',  type:"checkbox" },
		{ name: 'module', label: 'Module',  type:"checkbox" },
		{ name: 'air_disc', label: 'Air Disc',  type:"checkbox" },
	]
	const fields_1 = [ 
		{ name: 'repaired', label: 'Repaired',  type:"checkbox" }, 
		{ name: 'cleaned', label: 'Cleaned',  type:"checkbox" }
	]


	return(
		<div>
			<FormLayout 
				fields = {fields_1}
				title = "Services"
				hasTitle = {true}
			/>
			<br/>
			<FormLayout 
				fields = {fields}
				title = "Parts"
				hasTitle = {true}
			/>
		</div>
	)
}