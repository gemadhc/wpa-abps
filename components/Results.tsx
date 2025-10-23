import {useState, useEffect} from "react"
import Assembly from "./Assembly"
import Initial from "./Initial"
import Final from "./Final"

export default function Results(){
	const [activeTab, setActiveTab] = useState('Assembly');
	const tabs = [
	    { name: 'Assembly', content: <Assembly /> },
	    { name: 'Initial', content: <Initial /> },
	    { name: 'Final', content: <Final /> },
	  ];

	return(
		<div>
			<div className="flex flex-wrap gap-2 mb-3 pb-2 ">
	            {tabs.map((tab) => (
	              <button
	                key={tab.name}
	                onClick={() => setActiveTab(tab.name)}
	                className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
	                  activeTab === tab.name
	                    ? 'bg-blue-100 text-blue-700'
	                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
	                }`}
	              >
	                {tab.name}
	              </button>
	            ))}
	          </div>

	          {/* Active Tab Content */}
	          <div className="text-gray-700 text-sm  max-h-150 overflow-y-scroll">
	            {tabs.find((tab) => tab.name === activeTab)?.content}
	          </div>
		</div>
	)
}