'use client';
import { MapPin, Phone, Lock, FileText, Map, MapPinned } from 'lucide-react';

export default function Details({ stopDetails }) {
  const {
    name = 'Customer Name',
    phone = '(555) 555-5555',
    gate_number = '1234',
    site_note = 'Leave key under mat.',
    street = '123 Main St',
    city = 'Los Angeles',
    state = 'CA',
    zipcode = '90001',
  } = stopDetails || {};

  const address = `${street}, ${city}, ${state} ${zipcode}`;
  const encodedAddress = encodeURIComponent(address);

  const appleMapsLink = `https://maps.apple.com/?address=${encodedAddress}`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const phoneLink = `tel:${phone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-700 p-3 bg-white rounded-2xl shadow-sm">
      {/* Name */}
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-500" />
        <span className="font-medium">{name}</span>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-green-500" />
        <a href={phoneLink} className="text-blue-600 hover:underline">
          {phone}
        </a>
      </div>

      {/* Gate Number */}
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 text-gray-500" />
        <span>{gate_number}</span>
      </div>

      {/* Site Note */}
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-orange-500" />
        <span className="truncate">{site_note}</span>
      </div>

      {/* Apple Maps */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-red-500" />
        <a
          href={appleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Apple Maps
        </a>
      </div>

      {/* Google Maps */}
      <div className="flex items-center gap-2">
        <MapPinned className="w-4 h-4 text-yellow-500" />
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Google Maps
        </a>
      </div>
    </div>
  );
}
