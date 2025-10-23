import FormLayout from "../layouts/FormLayout"

export default function InitialRP(){
	const fields = [ 
		{ name: 'RPA_pressdrop', label: 'Pressdrop', type: "text" }, 
		{ name: 'RPA_opened_at', label: 'Opened At', type: "text" }, 
		{ name: 'RPA_did_not_open', label: 'Did Not Open', type: "checkbox" }, 
	]

	return(
		<FormLayout 
			fields = {fields}
			title="RP"
			hasTitle = {true}
		/>
	)
}