import FormLayout from "../layouts/FormLayout"

export default function InitialRP({report}){
	const fields = [ 
		{ name: 'RPA_pressdrop', label: 'Pressdrop', type: "text", full: true , noKeyboard: true}, 
		{ name: 'RPA_opened_at', label: 'Opened At', type: "text", full: true, noKeyboard: true}, 
		{ name: 'RPA_did_not_open', label: 'Did Not Open', type: "checkbox", full: true}, 
			]
	const fields_2 = [{ name: 'RPA2_tight', label: 'Tight', type:"checkbox" }]
	return(
		<div>
		<FormLayout 
			fields = {fields}
			title="Relief Valve"
			hasTitle = {true}
			initialValues = {report}
		/>
		<br/>
		<FormLayout 
			fields = {fields_2}
			title="Check #2"
			hasTitle = {true}
			initialValues = {report}
		/>
		</div>
	)
}