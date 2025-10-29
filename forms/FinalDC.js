'use client'

import FormLayout from "../layouts/FormLayout"
import {useState, useEffect } from "react"
export default function FinalDC({report}){
	const fields_1 = [ 
		{ name: 'repair_rpa_double_c1_tight', label: 'Tight', type:"checkbox" },
		{ name: 'repair_rpa_double_c1_leaked', label: 'Leaked', type:"checkbox" },
		{ name: 'repair_rpa_double_c1_psid', label: 'PSID', type:"text", noKeyboard: true }
	]
	const fields_2 = [ 
		{ name: 'repair_rpa_double_c2_tight', label: 'Tight', type:"checkbox" },
		{ name: 'repair_rpa_double_c2_leaked', label: 'Leaked', type:"checkbox" },
		{ name: 'repair_rpa_double_c2_psid', label: 'PSID', type:"text", noKeyboard: true }
	]

	const [typeII, setTypeII] = useState(false)

	return(
		<div>
			<FormLayout 
				fields = {fields_1}
				title = "Check #1"
				hasTitle = {true}
				initialValues = {report}
			/>
			<br/>

			<FormLayout 
				fields = {fields_2}
				title = "Check #2"
				hasTitle = {true}
				initialValues = {report}
			/>
		</div>
	)
}