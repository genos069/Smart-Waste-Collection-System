import { useState, useEffect } from "react";

export default function BinForm({ selectedCoords }) {
  const [name, setName] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [msg, setMsg] = useState("");

  const BASE_API = import.meta.env.VITE_API_URL || "http://localhost:4000";

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

    // ✅ proper validation (fixes 0/empty bug)
    if (!name || coords.lat === "" || coords.lng === "") {
      setMsg("Name, latitude and longitude are required");
      return;
    }

    const newBin = {
      name,
      lat: Number(coords.lat),
      lng: Number(coords.lng),
    };

    try {
      const res = await fetch(`${BASE_API}/pickups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newBin),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Error creating bin");
      } else {
        setMsg("Bin added successfully!");
        setName("");
        setCoords({ lat: "", lng: "" });
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add New Bin</h2>

      {msg && <p className="mb-2 text-blue-600">{msg}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Bin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="flex gap-2">

          <input
            type="number"
            placeholder="Latitude"
            value={coords.lat}
            onChange={(e) =>
              setCoords({ ...coords, lat: e.target.value })
            }
            className="border p-2 rounded flex-1"
          />

          <input
            type="number"
            placeholder="Longitude"
            value={coords.lng}
            onChange={(e) =>
              setCoords({ ...coords, lng: e.target.value })
            }
            className="border p-2 rounded flex-1"
          />

        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Bin
        </button>

      </form>

      <p className="mt-2 text-sm text-gray-500">
        Tip: Click on the map to auto-fill coordinates.
      </p>
    </div>
  );
}