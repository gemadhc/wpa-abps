import FormLayout from "../layouts/FormLayout"

export default function Assembly(){
	const fields = [ 
		{ name: 'serial_number', label: 'Serial Number', type: 'text' }, 
		{ name: 'location', label: 'Location', type: 'text'},
		{ name: 'make', label: 'Make', type: 'text'},
		{ name: 'model', label: 'Model', type: 'text'},
		 
			{ name: 'size', label: 'Size', type: 'select', options: [
			    { value: "SMALL", label: "Small" },
			    { value: "MEDIUM", label: "Medium" },
			    { value: "LARGE", label: "Large" }
			]},
			
			{ name: 'state', label: 'Status', type:"select", 
		options:[
			{ value: "EXISTING", label: "Existing"}, 
			{ value: "REMOVED", label: "Removed"}, 
			{ value: "NEW", label: "New"}, 
			{ value: "REPLACED", label: "Replaced"}
			] },
			{ name: 'hazard_type', label: 'Hazard', type: 'text'},
			{ name: 'track_number', label: 'Tracking Number', type: 'text'},
			{ name: 'locked_alarm', label: 'Locked Alarm', type: 'checkbox'},
	]

	return(
		<FormLayout 
			fields = {fields}
			title = "Assembly"
			hasTitle = {true}
			totalRows = {1}
		/>
	)
}