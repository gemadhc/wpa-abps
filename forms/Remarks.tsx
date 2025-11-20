import FormLayout from "../layouts/FormLayout"

export default function Remarks(){
	const fields = [ 
		{ name: 'so1', label: 'SO1', type:"radio", full: false }, 
		{ name: 'so1_rusted', label: 'Rusted', type:"checkbox", full: false},
		{ name: 'so2', label: 'SO2', type:"radio"}, 
		{ name: 'so2_rusted', label: 'Rusted', type:"checkbox"},
		{ name: 'upstream', label: 'Upstream', type:"radio"}, 
		{ name: 'upstream_rusted', label: 'Rusted', type:"checkbox", full: true},
		{ name: 'comments', label: 'Note', type:"textarea", full: true},
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "Remarks"
			hasTitle = {true}
		/>
	)
}