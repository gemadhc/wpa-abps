import FormLayout from "../layouts/FormLayout"

export default function InitialAG(){
	const fields = [ 
		{ name: 'pipesize', label: 'Pipe Size', type:"text" },
		{ name: 'physical_size', label: 'Physical Size', type:"text" }
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "Air Gap"
			hasTitle = {true}
		/>
	)
}