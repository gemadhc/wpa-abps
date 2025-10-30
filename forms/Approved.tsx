import FormLayout from "../layouts/FormLayout"

export default function Approved({report, onTargetChange, onReportChange}){
	const fields = [ 
		{ name: 'approved_assembly', label: 'Assembly', type: 'checkbox' },
		{ name: 'approved_USC', label: 'USC', type: 'checkbox' },
		{ name: 'approved_installation', label: 'Installation', type: 'checkbox' },
		{ name: 'approved_orientation', label: 'Orientation', type: 'checkbox' },
		{ name: 'approved_airgap', label: 'Air Gap', type: 'checkbox' }
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "Approved"
      		hasTitle = {true}
      		initialValues = { report }
      		onUpdate = {(updated)=>onReportChange(updated)}
		/>
	)
}