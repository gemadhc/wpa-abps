import FormLayout from "../layouts/FormLayout"

export default function InitiaXVB({report}){
	const fields_1 = [ 
		{ name: 'VB_air_opened_at', label: 'Opened At ', type:"text" , noKeyboard: true},
		{ name: 'VB_air_opened_fully', label: 'Opened Fully ', type:"checkbox" },
		{ name: 'VB_air_didNotOpen', label: 'Did Not Open', type:"checkbox" }
	]
	const fields_2 = [ 
		{ name: 'VB_check_pressdrop', label: 'Pressdrop', type:"text" , noKeyboard: true},
		{ name: 'VB_check_failed', label: 'Failed', type:"checkbox" }
	]

	return(
		<div>
			<FormLayout 
				fields = {fields_1}
				title= "Air Inlet"
				hasTitle = {true}
				initialValues = {report}
			/>
			<FormLayout 
				fields = {fields_2}
				title= "Check Valve"
				hasTitle = {true}
				initialValues = {report}
			/>
		</div>
	)
}