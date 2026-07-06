'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useSession } from "../../helpers/session";
import DatePicker from "../../components/DatePicker"
import Bins from "../../components/Bins"
import ListSorted from "./ListSorted"
import { ViewTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation';

import { requestDispatch, requestBins } from "@/actions/dispatch"

export default function Home() {
  const pacificTimeZone = 'America/Los_Angeles'

  const [list, setList] = useState([])
  const [bins, setBins] = useState([])
  const router = useRouter();
  // Initialize with Pacific time date
  const initialPacificDate = toZonedTime(new Date(), pacificTimeZone)
  const [myDate, setMyDate] = useState(format(initialPacificDate, "yyyy-MM-dd"))
  const {session} = useSession()
  // Load current day's stops on initial render
  useEffect(() => {
    router.push( "/")
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      nothing to show
    </div>
  )
}
