'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useSession } from "../../helpers/session";
import DatePicker from "../../components/DatePicker"
import Bins from "../../components/Bins"
import ListSorted from "./ListSorted"
import WaterLoader from "../../components/WaterLoader"
import { requestDispatch, requestBins } from "../../actions/dispatch"
import { createStop } from "../../lib/stop_db"
import {DateProvider, useDate} from "@/contexts/DateContext"


export default function Home() {
  const pacificTimeZone = 'America/Los_Angeles'
  const [list, setList] = useState([])
  const [bins, setBins] = useState([])
  const [completed, setCompleted] = useState(0)
  const [loading, setLoading] = useState(false)
  const { date, setDate, resetToToday } = useDate();

  // Initialize with Pacific time date
  const initialPacificDate = toZonedTime(new Date(), pacificTimeZone)
  const [myDate, setMyDate] = useState( date )

  const {session} = useSession()
  useEffect(()=>{
    list.map( (item) => createStop(item) )
    let total_completed = list.reduce(
        (count, item) => count + (item.status === "COMPLETED" ? 1 : 0),
        0
      );

      setCompleted(total_completed);

  }, [list])

  useEffect( ()=>{
  }, [session])

  // Function to load stops and bins for a given date
  const handleDateChange = async (isoDate: string) => {
    const dateToUse = isoDate || myDate
    console.log("dateToUse", dateToUse)
    setDate(dateToUse)
    setMyDate(dateToUse)
    try {
      setLoading(true)
      const stopsData = await requestDispatch(dateToUse)
      setList(stopsData)
      const binsData = await requestBins(dateToUse)
      setBins(binsData)
      setLoading(false);

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
      <DateProvider>
        {/* HEADER SECTION */}
        <div className="flex flex-row justify-between py-2 px-10 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 gap-10">
          <DatePicker value={myDate} onSelected={handleDateChange} />
          <div className="w-15 px-2 pt-2 font-semibold text-center text-green-800  border border-green-800 rounded-lg">
            {completed}/{list.length}
          </div>
        </div>

        {/* BINS COMPONENT */}
        <div className="border-b border-gray-200">
          <Bins list={bins} />
        </div>

        {/* LIST SECTION */}
        <div className="flex-1 max-h-200 overflow-y-scroll p-0 space-y-0 bg-white pb-500">
        	{
        		loading ? 
        			<div className = "pt-15"> 
        				<p className = "text-slate-500 font-bold text-center "> Loading Stops </p>
        				<WaterLoader />
        			</div>
        		: 
        		<>
        			{
  		          list.length ?
  		            <ListSorted  
  		              stops={list}
  		              reloadList={() => handleDateChange(myDate)}
  		            />
  		          :
  		            <div className = "p-10 rounded-xl shadow">
  		              <p className = "text-slate-500 font-bold text-center ">No Stops To Show </p>
  		            </div>
  		        }
        		</>
        	}
        </div>
      </DateProvider>
    </div>

  )
}
