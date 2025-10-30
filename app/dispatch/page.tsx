'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

import DatePicker from "../../components/DatePicker"
import Bins from "../../components/Bins"
import StopCard from "../../components/StopCard"
import ListSorted from "./ListSorted"

import { requestDispatch, requestBins } from "../../actions/dispatch"

export default function Home() {
  const pacificTimeZone = 'America/Los_Angeles'

  const [list, setList] = useState([49412, 49416])
  const [bins, setBins] = useState([1, 2, 3, 4, 5, 6, 7, 8])
  
  // Initialize with Pacific time date
  const initialPacificDate = toZonedTime(new Date(), pacificTimeZone)
  const [myDate, setMyDate] = useState(format(initialPacificDate, "yyyy-MM-dd"))

  const handleDateChange = (isoDate: string) => {
      setMyDate(isoDate)
      console.log("Requesting date:", isoDate)
      requestDispatch(isoDate).then((data, err) =>{
        setList(data)
      })
      
      requestBins(isoDate).then((data, err) =>{
        setBins(data)
      })
    }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* HEADER SECTION */}
      <div className="flex flex-row items-center justify-evenly py-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <DatePicker value={myDate} onSelected={handleDateChange} />
        <div className="w-10 p-1 font-semibold text-center bg-blue-50 rounded-lg">
          {list.length}
        </div>
      </div>

      {/* BINS COMPONENT */}
      <div className="p-1 border-b border-gray-200">
        <Bins list={bins} />
      </div>

      {/* LIST SECTION */}
      <div className="flex-1 max-h-150 overflow-y-scroll p-3 space-y-0 bg-gray-50">
         <ListSorted  
          stops= {list}
          reloadList = {  
              ()=> requestDispatch(myDate).then((data, err) =>{
                setList(data)
              })
        }
        />
      </div>
    </div>
  )
}
