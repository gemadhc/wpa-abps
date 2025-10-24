'use client'
import FormLayout from "../layouts/FormLayout"
import {useState, useEffect } from "react"

export default function InitialDC(){
	const fields_1 = [ 
		{ name: 'RPA_typeII', label: 'Type II', type:"checkbox", full: true},
		{ name: 'RPA1_tight', label: 'Tight', type:"checkbox" },
		{ name: 'RPA1_leaked', label: 'Leaked', type:"checkbox" },
		{ name: 'RPA1_psid', label: 'PSID', type:"text" }
	]
	const fields_2 = [ 
		{ name: 'RPA2_tight', label: 'Tight', type:"checkbox" },
		{ name: 'RPA2_leaked', label: 'Leaked', type:"checkbox" },
		{ name: 'RPA2_psid', label: 'PSID', type:"text" }
	]

	const [typeII, setTypeII] = useState(false)

	return(
		<div>
			<FormLayout 
				fields = {fields_1}
				title = "Check #1"
				hasTitle = {true}
			/>
			<br/>

			<FormLayout 
				fields = {fields_2}
				title = "Check #2"
				hasTitle = {true}
			/>
		</div>
	)
}