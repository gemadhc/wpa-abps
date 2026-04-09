export default function WaterLoader() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="relative w-64 h-6 bg-gray-200 rounded-full overflow-hidden">
        
        {/* Flowing water */}
        <div
          className="absolute bottom-0 left-0 bg-slate-400 transition-all duration-500 water-wave"
          style={{ width: "100%", height: "100%" }}
        />

      </div>
    </div>
  );
}