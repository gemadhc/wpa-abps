import FormLayout from "../layouts/FormLayout"

export default function FinalSystem(){
	const fields = [ 
		{ name: 'fullName', label: 'Full Name', placeholder: 'Enter your name', required: true }
	]

	return(
		<FormLayout 
			fields = {fields}
		/>
	)
}