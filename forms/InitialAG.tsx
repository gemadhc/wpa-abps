import FormLayout from "../layouts/FormLayout"

export default function InitialAG({report, onTargetChange, onReportChange}){
	const fields = [ 
		{ name: 'pipesize', label: 'Pipe Size', type:"text", noKeyboard: true, getTargetName: (name: string) => onTargetChange && onTargetChange(name) },
		{ name: 'physical_size', label: 'Physical Size', type:"text", noKeyboard: true, getTargetName: (name: string) => onTargetChange && onTargetChange(name) }
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "Air Gap"
			hasTitle = {true}
			initialValues = {report}
			onUpdate = {(updated)=>onReportChange(updated)}
		/>
	)
}