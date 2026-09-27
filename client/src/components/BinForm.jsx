import { createBin } from "../services/binService";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, MapPin, Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10";

export default function BinForm({ selectedCoords }) {
  const [name, setName] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (selectedCoords) {
      setCoords({
        lat: selectedCoords.lat,
        lng: selectedCoords.lng,
      });
    }
  }, [selectedCoords]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = Number(coords.lat);
    const lng = Number(coords.lng);

    if (!name.trim() || coords.lat === "" || coords.lng === "") {
      setMessage({ type: "error", text: "Enter a bin name and both coordinates." });
      return;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setMessage({ type: "error", text: "Enter a valid latitude and longitude." });
      return;
    }

    setMessage(null);
    setIsSubmitting(true);

    try {
      await createBin({ name: name.trim(), lat, lng });

      setMessage({ type: "success", text: "Bin added successfully." });
      setName("");
      setCoords({ lat: "", lng: "" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Could not connect to the server. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="add-bin-heading" className="w-full">
      <div className="flex items-start gap-3 border-b border-gray-100 pb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
            Bin management
          </p>
          <h2 id="add-bin-heading" className="mt-0.5 text-lg font-bold text-gray-900">
            Add a new bin
          </h2>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            Register a collection point on the map.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="bin-name" className="mb-2 block text-sm font-medium text-gray-700">
            Bin name <span className="text-red-500">*</span>
          </label>
          <input
            id="bin-name"
            type="text"
            placeholder="e.g. Market Street Bin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            autoComplete="off"
            required
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 text-green-700" aria-hidden="true" />
            Location coordinates
          </div>
          <p className="mb-3 text-xs leading-5 text-gray-500">
            Click the map to fill these automatically, or enter them below.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="min-w-0">
              <label htmlFor="bin-lat" className="mb-1.5 block text-xs font-medium text-gray-600">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                id="bin-lat"
                type="number"
                step="any"
                min="-90"
                max="90"
                placeholder="e.g. 19.3150"
                value={coords.lat}
                onChange={(e) => setCoords((current) => ({ ...current, lat: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="bin-lng" className="mb-1.5 block text-xs font-medium text-gray-600">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                id="bin-lng"
                type="number"
                step="any"
                min="-180"
                max="180"
                placeholder="e.g. 84.7941"
                value={coords.lng}
                onChange={(e) => setCoords((current) => ({ ...current, lng: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>

        {message && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${message.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-800"}`}
          >
            {message.type === "error" ? (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          {isSubmitting ? "Adding bin..." : "Add bin"}
        </button>
      </form>
    </section>
  );
}
