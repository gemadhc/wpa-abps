'use client'

import FormLayout from "../layouts/FormLayout"
import {useState, useEffect } from "react"
import InputWithLabel from "../components/InputWithLabel";

export default function FinalDC({report, onTargetChange, onReportChange}){
	const fields_1 = [ 
		{ name: 'repair_rpa_double_c1_tight', label: 'Tight', type:"checkbox" },
		{ name: 'repair_rpa_double_c1_leaked', label: 'Leaked', type:"checkbox" },
		{ name: 'repair_rpa_double_c1_psid', label: 'PSID', type:"text", noKeyboard: true, 
			getTargetName: (name: string) => onTargetChange && onTargetChange(name)
		 }
	]
	const fields_2 = [ 
		{ name: 'repair_rpa_double_c2_tight', label: 'Tight', type:"checkbox" },
		{ name: 'repair_rpa_double_c2_leaked', label: 'Leaked', type:"checkbox" },
		{ name: 'repair_rpa_double_c2_psid', label: 'PSID', type:"text", noKeyboard: true, 
			getTargetName: (name: string) => onTargetChange && onTargetChange(name)
		}
	]

	const [typeII, setTypeII] = useState(false)

	return(
		<div>
			<h3> Check #1 </h3>
			<InputWithLabel
		        labelName="repair_rpa_double_c1_psid"
		        labelGreater="Tight"
		        labelLess="Leaked"
		        breakpoint={1.0}
		        dependents={[{ greaterThan: "repair_rpa_double_c1_tight", lessThan: "repair_rpa_double_c1_leaked" }]}
		    />
			<h3> Check #2 </h3>
			<InputWithLabel
		        labelName="repair_rpa_double_c2_psid"
		        labelGreater="Tight"
		        labelLess="Leaked"
		        breakpoint={1.0}
		        dependents={[{ greaterThan: "repair_rpa_double_c2_tight", lessThan: "repair_rpa_double_c2_leaked" }]}
		    />
		</div>
	)
}