import FormLayout from "../layouts/FormLayout"

export default function System({report, onTargetChange, onReportChange}){
	const fields = [ 
		{ name: 'initialTest_pass', label: 'Pass', type:"checkbox", full: false}, 
		{ name: 'initialTest_fail', label: 'Fail', type:"checkbox", full: false },
		{ name: 'initialTest_system_psid', label: 'System PSI', type:"text",   noKeyboard: true, 
      getTargetName: (name: string) => onTargetChange && onTargetChange(name)}, 
		{ name: 'initialTest_dmr', label: 'DMR', type:"text",   noKeyboard: true, 
      getTargetName: (name: string) => onTargetChange && onTargetChange(name) },
		{ name: 'restored', label: "System Restored", type:"checkbox", full: true }
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "System"
			hasTitle = {true}
			initialValues = { report }
			onUpdate = {(updated)=>onReportChange(updated)}
		/>
	)
}