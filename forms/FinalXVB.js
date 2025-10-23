import FormLayout from "../layouts/FormLayout"

export default function FinalXVB(){
	const fields_1 = [ 
		{ name: 'repair_vb_air_opened_at', label: 'Opened At ', type:"text" },
		{ name: 'repair_vb_air_opened_fully', label: 'Opened Fully ', type:"checkbox" },
		{ name: 'repair_vb_air_did_not_open', label: 'Did Not Open', type:"checkbox" }
	]
	const fields_2 = [ 
		{ name: 'repair_vb_check_pressdrop', label: 'Pressdrop', type:"text" },
		{ name: 'repair_vb_check_failed', label: 'Failed', type:"checkbox" }
	]

	return(
		<div>
			<FormLayout 
				fields = {fields_1}
				title= "Air Inlet"
				hasTitle = {true}
			/>
			<FormLayout 
				fields = {fields_2}
				title= "Check Valve"
				hasTitle = {true}
			/>
		</div>
	)
}