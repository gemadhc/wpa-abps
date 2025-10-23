'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function StopCard({ stopID }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Details');

  // Array of tab objects
  const tabs = [
    { name: 'Details', content: <>Details</> },
    { name: 'Assemblies', content: <>Assemblies</> },
    { name: 'Invoice', content: <>Invoice</> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg max-w-xl mx-auto ">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
        <div>
          <div className="text-sm text-gray-600 font-medium mb-1">TIMED • STATUS • ROUTED</div>
          <div className="text-base font-semibold text-gray-800">LOCATION NAME</div>
          <div className="text-sm text-gray-500">Street, City, State ZIP</div>
          <div className="text-sm text-gray-600 mt-2 italic">Schedule note...</div>
          <div className="text-xs text-gray-400 mt-1">
            Scheduled by: <span className="font-medium text-gray-700">Name</span>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-800 transition"
          aria-label="Toggle details"
        >
          {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      {/* Accordion Section */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-white">
          {/* Tabs */}
          <div className="flex gap-3 mb-3 pb-2">
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
          <div className="text-gray-700 text-sm">
            {tabs.find((tab) => tab.name === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
