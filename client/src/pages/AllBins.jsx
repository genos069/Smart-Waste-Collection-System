import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AllBins() {
  const [bins, setBins] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // ── Fetch bins ─────────────────────────────────────────────
  const fetchBins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API}/allBins`, {
        credentials: "include",
      });
      const data = await res.json();

      setBins(data.data || []);
    } catch (err) {
      console.error("[AllBins] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, []);

  // ── Delete single bin ─────────────────────────────────────
  const deleteBin = async (id) => {
    try {
      await fetch(`${BASE_API}/deleteBin/${id}`, {
        method: "DELETE",
      });

      fetchBins();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Delete all bins ───────────────────────────────────────
  const deleteAllBins = async () => {
    try {
      await fetch(`${BASE_API}/deleteAllBins`, {
        method: "DELETE",
      });

      setSelected([]);
      fetchBins();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Select logic ──────────────────────────────────────────
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected =
    bins.length > 0 && selected.length === bins.length;

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : bins.map((b) => b._id));
  };

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="shrink-0 bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:scale-110 text-gray-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-semibold text-gray-800">
          Bin Management
        </h1>
      </div>

      {/* Controls */}
      <div className="p-6 max-w-5xl mx-auto w-full">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            All Bins
          </h2>

          <div className="flex gap-2">

            <button
              onClick={fetchBins}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              Refresh
            </button>

            <button
              onClick={deleteAllBins}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
            >
              Delete All
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">

          <table className="w-full text-left text-sm">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4">Name</th>
                <th className="p-4">Longitude</th>
                <th className="p-4">Latitude</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : bins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    No bins found
                  </td>
                </tr>
              ) : (
                bins.map((bin) => {
                  const [lng, lat] =
                    bin.coordinates?.coordinates || [];

                  return (
                    <tr
                      key={bin._id}
                      className={`border-t ${selected.includes(bin._id)
                          ? "bg-red-50"
                          : "hover:bg-gray-50"
                        }`}
                    >

                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(bin._id)}
                          onChange={() => handleSelect(bin._id)}
                        />
                      </td>

                      <td className="p-4 font-medium">
                        {bin.name}
                      </td>

                      <td className="p-4 text-gray-600">
                        {lng ?? "—"}
                      </td>

                      <td className="p-4 text-gray-600">
                        {lat ?? "—"}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => deleteBin(bin._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}