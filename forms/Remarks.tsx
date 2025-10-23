import FormLayout from "../layouts/FormLayout"

export default function Remarks(){
	const fields = [ 
		{ name: 'so1', label: 'SO1 Open', type:"radio", full: false }, 
		{ name: 'so1_rusted', label: 'SO1 Rusted', type:"checkbox", full: false},
		{ name: 'so2', label: 'SO2 Open', type:"radio"}, 
		{ name: 'so2_rusted', label: 'SO2 Rusted', type:"checkbox"},
		{ name: 'upstream', label: 'Upstream Open', type:"radio"}, 
		{ name: 'upstream_rusted', label: 'Upstream Rusted', type:"checkbox"},
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "Remarks"
			hasTitle = {true}
		/>
	)
}