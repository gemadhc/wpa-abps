import FormLayout from "../layouts/FormLayout"

export default function FinalRP(){
	const fields = [ 
		{ name: 'repair_rpa_pressdrop', label: 'Pressdrop', type: "text" }, 
		{ name: 'repair_rpa_openedat', label: 'Opened At', type: "text" }, 
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