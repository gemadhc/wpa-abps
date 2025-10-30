import FormLayout from "../layouts/FormLayout"

export default function InitiaXVB({report, onTargetChange, onReportChange}){
	const fields_1 = [ 
		{ name: 'VB_air_opened_at', label: 'Opened At ', type:"text" , noKeyboard: true, getTargetName: (name: string) => onTargetChange && onTargetChange(name)},
		{ name: 'VB_air_opened_fully', label: 'Opened Fully ', type:"checkbox" },
		{ name: 'VB_air_didNotOpen', label: 'Did Not Open', type:"checkbox" }
	]
	const fields_2 = [ 
		{ name: 'VB_check_pressdrop', label: 'Pressdrop', type:"text" , noKeyboard: true,  getTargetName: (name: string) => onTargetChange && onTargetChange(name)},
		{ name: 'VB_check_failed', label: 'Failed', type:"checkbox" }
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