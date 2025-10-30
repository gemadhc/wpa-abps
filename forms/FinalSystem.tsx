import FormLayout from "../layouts/FormLayout"

export default function FinalSystem({report, onTargetChange, onReportChange}){
	const fields = [ 
		{ name: 'repair_pass', label: 'Pass', type:"checkbox", full: false}, 
		{ name: 'repair_fail', label: 'Fail', type:"checkbox", full: false },	
	]
	return(
		<FormLayout 
			fields = {fields}
			title = "System"
			hasTitle = {true} 
			initialValues = {report}
			onUpdate = {(updated)=>onReportChange(updated)}
		/>
	)
}