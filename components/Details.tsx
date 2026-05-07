'use client';
import { MapPin, Phone, Lock, FileText, Map, MapPinned, Watch} from 'lucide-react';
import { useState, useEffect } from 'react';


export default function Details({ stopDetails, item }) {
  const {
    name = item.requestor|| 'N/A',
    phone = item.phone || '360-605-9507',
    gate_number = item.gate_code || 'N/A',
    street = item.street,
    city = item.city,
    state = item.state,
    zipcode = item.zipcode,
  } = stopDetails || {};

  const address = `${street}, ${city}, ${state} ${zipcode}`;
  const encodedAddress = encodeURIComponent(address);

  const [isTimed, setIsTimed] = useState(true);
  const [isSpecificTime, setIsSpecificTime] = useState(false);
  const appleMapsLink = `https://maps.apple.com/?address=${encodedAddress}`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const phoneLink = `tel:${phone.replace(/[^0-9]/g, '')}`;

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

   useEffect(() => {
    if (item) {
      if (item.startTime === "08:00" && item.endTime === "16:00") {
        setIsTimed(true);
      } else {
        setIsTimed(true);
        setIsSpecificTime(item.startTime === item.endTime);
      }
    }
  }, [item]);

  return (
    <div className="bg-white p-10 h-screen text-slate-800 ">

  {/* COMMENT / HEADER */}
  <div className=" font-semibold leading-snug mb-10">
    {item.comment}
  </div>

  

  {/* INFO BLOCK */}
  <div className="space-y-3 text-sm text-gray-700">
    {
      isTimed ?
        <div className="flex items-center gap-3  rounded-xl  transition ">
          <Watch className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 font-medium text-base">
            {formatTime(item.startTime) } - { formatTime(item.endTime) }
          </span>
        </div>
      : 
        <> </> 
    }
    {/* Name */}
    <div className="flex items-center gap-3">
      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
      <span className="font-medium text-gray-900">{name}</span>
    </div>

    {/* Gate */}
    {gate_number && (
      <div className="flex items-center gap-3">
        <Lock className="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span className="text-gray-800">Gate: {gate_number}</span>
      </div>
    )}

    {/* Phone (BIG TAP TARGET) */}
    {
      phone  != "N/A" ? 
        <a
          href={phoneLink}
          className="flex items-center gap-3  rounded  p-3 transition border border-green-500 bg-green-100 mt-10 "
        >
          <Phone className="w-5 h-5 text-green-600 flex-shrink-0 " />
          <span className="text-green-700 font-medium text-base">
            {phone}
          </span>
        </a>
      : <> </>

    }
    

    

  </div>

  {/* ACTION BUTTONS (MAPS) */}
  <div className="grid grid-cols-2 gap-3 pt-10">

    <a
      href={appleMapsLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-2 p-3 rounded  bg-indigo-100 text-indigo-900 transition text-sm font-medium"
    >
      <MapPin className="w-5 h-5 text-indigo-700" />
      Apple Maps
    </a>

    <a
      href={googleMapsLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-2 p-3 rounded bg-amber-100 text-amber-900 active:bg-yellow-100 transition text-sm font-medium"
    >
      <MapPinned className="w-5 h-5 text-yellow-600" />
      Google Maps
    </a>

  </div>

</div>
  );
}
