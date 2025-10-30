import FormLayout from "../layouts/FormLayout"

export default function InitialRP({report,  onTargetChange, onReportChange}){
	const fields = [ 
		{ name: 'RPA_pressdrop', label: 'Pressdrop', type: "text", full: true ,
			noKeyboard: true, 
     		getTargetName: (name: string) => onTargetChange && onTargetChange(name)}, 
		{ name: 'RPA_opened_at', label: 'Opened At', type: "text", full: true, 
			noKeyboard: true, 
      		getTargetName: (name: string) => onTargetChange && onTargetChange(name)
      	}, 
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
				onUpdate = {(updated)=>onReportChange(updated)}
			/>
			<br/>
			<FormLayout 
				fields = {fields_2}
				title="Check #2"
				hasTitle = {true}
				initialValues = {report}
				onUpdate = {(updated)=>onReportChange(updated)}
			/>
		</div>
	)
}