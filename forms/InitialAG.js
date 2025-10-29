import FormLayout from "../layouts/FormLayout"

export default function InitialAG({report}){
	const fields = [ 
		{ name: 'pipesize', label: 'Pipe Size', type:"text", noKeyboard: true },
		{ name: 'physical_size', label: 'Physical Size', type:"text", noKeyboard: true }
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "Air Gap"
			hasTitle = {true}
			initialValues = {report}
		/>
	)
}