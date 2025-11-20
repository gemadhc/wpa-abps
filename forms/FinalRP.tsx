import FormLayout from "../layouts/FormLayout"

export default function FinalRP({report, onTargetChange, onReportChange}){
	const fields = [ 
		{ name: 'repair_rpa_pressdrop', label: 'Pressdrop', type: "text", full: true , noKeyboard: true, 
			getTargetName: (name: string) => onTargetChange && onTargetChange(name)
		}, 
		{ name: 'repair_rpa_openedat', label: 'Opened At', type: "text",full: true , noKeyboard: true, 
			getTargetName: (name: string) => onTargetChange && onTargetChange(name)
		}, 
		{ name: 'RPA_did_not_open', label: 'Did Not Open', type: "checkbox", full: true }, 
	]
	const fields_2 = [ 
		{ name: 'repair_rpa_double_c2_tight', label: 'Tight', type:"checkbox", full: true}
	]


	return(
		<div>
			<FormLayout 
				fields = {fields}
				title="Relief Valve"
				hasTitle = {true}
				totalRows = {1}
			/>
			<br/>
			<FormLayout 
				fields = {fields_2}
				title="Check #2"
				hasTitle = {true}
				totalRows = {1}	
			/>
		</div>
	)
}