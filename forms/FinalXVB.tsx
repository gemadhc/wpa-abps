import FormLayout from "../layouts/FormLayout"

export default function FinalXVB({report,  onTargetChange, onReportChange}){
	const fields_1 = [ 
		{ name: 'repair_vb_air_opened_at', label: 'Opened At ', type:"text" , noKeyboard: true, 
			getTargetName: (name: string) => onTargetChange && onTargetChange(name)
		},
		{ name: 'repair_vb_air_opened_fully', label: 'Opened Fully ', type:"checkbox" },
		{ name: 'repair_vb_air_did_not_open', label: 'Did Not Open', type:"checkbox" }
	]
	const fields_2 = [ 
		{ name: 'repair_vb_check_pressdrop', label: 'Pressdrop', type:"text", noKeyboard: true, 
			getTargetName: (name: string) => onTargetChange && onTargetChange(name)
		},
		{ name: 'repair_vb_check_failed', label: 'Failed', type:"checkbox" }
	]

	return(
		<div>
			<FormLayout 
				fields = {fields_1}
				title= "Air Inlet"
				hasTitle = {true}
				initialValues = {report}
				onUpdate = {(updated)=>onReportChange(updated)}
			/>
			<FormLayout 
				fields = {fields_2}
				title= "Check Valve"
				hasTitle = {true}
				initialValues = {report}
				onUpdate = {(updated)=>onReportChange(updated)}
			/>
		</div>
	)
}