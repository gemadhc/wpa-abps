import Parts from "../forms/Parts"
import FinalSystem from "../forms/FinalSystem"
import FinalDC from "../forms/FinalDC"

export default function Final(){
	return(
		<div>
			<Parts />
			<FinalDC />
			<FinalSystem />
		</div>
	)
}