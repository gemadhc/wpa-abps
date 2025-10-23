'use client'
import FormLayout from "../layouts/FormLayout"
import {useState, useEffect } from "react"

export default function InitialDC(){
	const fields_1 = [ 
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
			<label
                key="RPA_typeII"
              >
                <input
                  type="checkbox"
                  checked={typeII}
                  onClick={(event)=> setTypeII(event.target.checked)}
                  className="w-4 h-4 mr-5 accent-blue-600"
                />
                Type II
             </label>
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