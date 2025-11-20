import FormLayout from "../layouts/FormLayout"

export default function InitialAG(){
	const fields = [ 
		{ name: 'pipesize', label: 'Pipe Size', type:"text", noKeyboard: true, getTargetName: (name: string) => onTargetChange && onTargetChange(name) },
		{ name: 'physical_separation', label: 'Physical Separation', type:"text", noKeyboard: true, getTargetName: (name: string) => onTargetChange && onTargetChange(name) }
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "Air Gap"
			hasTitle = {true}
			totalRows = {1}
		/>
	)
}