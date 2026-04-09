'use client';
import { MapPin, Phone, Lock, FileText, Map, MapPinned } from 'lucide-react';

export default function Details({ stopDetails, item }) {
  const {
    name = item.requestor|| '',
    phone = item.phone || '',
    gate_number = item.gate_number || '',
    street = item.street,
    city = item.city,
    state = item.state,
    zipcode = item.zipcode,
  } = stopDetails || {};

  const address = `${street}, ${city}, ${state} ${zipcode}`;
  const encodedAddress = encodeURIComponent(address);

  const appleMapsLink = `https://maps.apple.com/?address=${encodedAddress}`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const phoneLink = `tel:${phone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="bg-white rounded-2xl ">

  {/* COMMENT / HEADER */}
  <div className="text-base font-semibold text-gray-900 leading-snug mb-10">
    {item.comment}
  </div>

  {/* INFO BLOCK */}
  <div className="space-y-3 text-sm text-gray-700">

    {/* Name */}
    <div className="flex items-center gap-3">
      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
      <span className="font-medium text-gray-900">{name}</span>
    </div>

    {/* Phone (BIG TAP TARGET) */}
    <a
      href={phoneLink}
      className="flex items-center gap-3 p-3 rounded-xl bg-green-50 active:bg-green-100 transition"
    >
      <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
      <span className="text-green-700 font-medium text-base">
        {phone}
      </span>
    </a>

    {/* Gate */}
    {gate_number && (
      <div className="flex items-center gap-3">
        <Lock className="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span className="text-gray-800">Gate: {gate_number}</span>
      </div>
    )}

  </div>

  {/* ACTION BUTTONS (MAPS) */}
  <div className="grid grid-cols-2 gap-3 pt-2">

    <a
      href={appleMapsLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 active:bg-gray-200 transition text-sm font-medium"
    >
      <MapPin className="w-5 h-5 text-gray-700" />
      Apple Maps
    </a>

    <a
      href={googleMapsLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-yellow-50 active:bg-yellow-100 transition text-sm font-medium"
    >
      <MapPinned className="w-5 h-5 text-yellow-600" />
      Google Maps
    </a>

  </div>

</div>
  );
}
