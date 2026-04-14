import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BinMap from "../../components/BinMap";
import BinForm from "../../components/BinForm";

export default function AdminMapPage() {
  const navigate = useNavigate();

  const [selectedCoords, setSelectedCoords] = useState({ lat: 0, lng: 0 });

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      <div className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">

        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-semibold text-gray-800">Return to Admin Dashboard</h1>

        {(selectedCoords.lat !== 0 || selectedCoords.lng !== 0) && (
          <span className="ml-auto text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 font-mono">
            📍 {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
          </span>
        )}

      </div>

      <div className="flex-1 flex overflow-hidden">

        <div className="flex-1 relative">

          <BinMap setSelectedCoords={setSelectedCoords} />

          {selectedCoords.lat === 0 && selectedCoords.lng === 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[500] bg-black/70 text-white text-sm px-4 py-2 rounded-full pointer-events-none">
              👆 Click anywhere on the map to pick a location
            </div>
          )}

        </div>

        <div className="w-80 shrink-0 bg-white border-l border-gray-200 overflow-y-auto shadow-xl">

          <div className="p-5">

            <h2 className="text-base font-semibold text-gray-800 mb-1">Click the map to auto-fill coordinates.</h2>

            <BinForm selectedCoords={selectedCoords} />

          </div>

        </div>

      </div>

    </div>
  );
}
