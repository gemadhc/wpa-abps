'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { navigateWithTransition } from "@/lib/viewTransition";


export default function StopCard({ stopID, item, onSelectStop}) {
  const router = useRouter();

  const [completed, setCompleted] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [isSpecificTime, setIsSpecificTime] = useState(false);

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
        setIsTimed(false);
      } else {
        setIsTimed(true);
        setIsSpecificTime(item.startTime === item.endTime);
      }

      if (item.status?.toUpperCase() === "COMPLETED") {
        setCompleted(true);
      }
    }
  }, [item]);
  useEffect(()=>{
    router.prefetch(`/stop/${item.stopID}`);
  }, [])

  const headerBg =
    item.status === 'COMPLETED'
      ? 'bg-green-100 border-green-300'
      : 'bg-gray-50 border-gray-200';

  const handleNavigate = () => {
    onSelectStop(stopID)
  };

  return (
    <div
      onClick={handleNavigate}
      className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] max-w-xl mx-auto"
      style={{ viewTransitionName: `stop-${stopID}` }}
    >
      <div className={`flex justify-between items-start p-3 ${headerBg} border-b gap-2`}>
        
        <div className="flex-1">
          <div className="text-sm text-gray-600 font-medium mb-1">
            {isTimed && (
              <span className="text-red-500 font-bold">
                {isSpecificTime ? (
                  <>{formatTime(item.startTime)} • </>
                ) : (
                  <>
                    {formatTime(item.startTime)} - {formatTime(item.endTime)} •{' '}
                  </>
                )}
              </span>
            )}
            {item.status} • {item.isRouted ? 'ROUTED' : 'NOT ROUTED'}
          </div>

          <div className="text-base font-semibold text-gray-800">
            {item.location_name}
          </div>

          <div className="text-sm text-gray-500">
            {item?.street?.toLowerCase() || ''} <br />
            {item?.city?.toLowerCase() || ''} {item?.state || ''} {item?.zipcode?.toLowerCase() || ''}
          </div>

          <div className="text-sm text-gray-600 mt-2 italic">
            {(item.comment || "").length > 90
              ? `${item.comment.slice(0, 90)}…`
              : item.comment}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            Scheduled by:{' '}
            <span className="font-medium text-gray-700">
              {item.tester_name}
            </span>
          </div>
        </div>

        {/* Status Icon */}
        <div className="flex items-center">
          {completed && (
            <CheckCircle2 className="text-green-600 w-6 h-6" />
          )}
        </div>
      </div>
    </div>
  );
}