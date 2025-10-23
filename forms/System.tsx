import FormLayout from "../layouts/FormLayout"

export default function System(){
	const fields = [ 
		{ name: 'initialTest_pass', label: 'Pass', type:"checkbox", full: false}, 
		{ name: 'initialTest_fail', label: 'Fail', type:"checkbox", full: false },
		{ name: 'initialTest_system_psid', label: 'System PSI', type:"text", full: true}, 
		{ name: 'initialTest_dmr', label: 'DMR', type:"text", full: true },
		{ name: 'restored', label: "System Restored", type:"checkbox", full: true }
	]

	return(
		<FormLayout 
			fields = {fields}
		/>
	)
}