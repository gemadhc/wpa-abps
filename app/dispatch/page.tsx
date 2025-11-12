'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useSession } from "../../helpers/session";
import DatePicker from "../../components/DatePicker"
import Bins from "../../components/Bins"
import ListSorted from "./ListSorted"

import { requestDispatch, requestBins } from "../../actions/dispatch"

export default function Home() {
  const pacificTimeZone = 'America/Los_Angeles'

  const [list, setList] = useState([])
  const [bins, setBins] = useState([])
  
  // Initialize with Pacific time date
  const initialPacificDate = toZonedTime(new Date(), pacificTimeZone)
  const [myDate, setMyDate] = useState(format(initialPacificDate, "yyyy-MM-dd"))
  const {session} = useSession()

  useEffect( ()=>{
    console.log("This is the session: ", session)
  }, [session])

  // Function to load stops and bins for a given date
  const handleDateChange = async (isoDate: string) => {
    const dateToUse = isoDate || myDate
    setMyDate(dateToUse)
    try {
      const stopsData = await requestDispatch(dateToUse)
      setList(stopsData)

      const binsData = await requestBins(dateToUse)
      setBins(binsData)
    } catch (err) {
      console.error("Error fetching dispatch/bins:", err)
    }
  }

  // Load current day's stops on initial render
  useEffect(() => {
    handleDateChange(myDate)
  }, [])

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
      <div className="flex-1 max-h-200 overflow-y-scroll p-3 space-y-0 bg-slate-50 pb-500">
        {
          list.length ?
            <ListSorted  
              stops={list}
              reloadList={() => handleDateChange(myDate)}
            />
           
          :
            <div className = "p-10 rounded-xl shadow">
              <h4>No Stops To Show </h4>
            </div>
        }
        
      </div>
    </div>
  )
}
