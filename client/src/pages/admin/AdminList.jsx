import { useEffect, useState } from "react";
import { getAdmins, deleteAdmin } from "../../services/adminService";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setError("");
      setAdmins(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    let active = true;
    getAdmins().then((data) => {
      if (active) setAdmins(data.data || []);
    }).catch((err) => {
      if (active) setError(err.message);
    });
    return () => { active = false; };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAdmin(id);
      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admins</h2>

      {error && <p role="alert">{error}</p>}

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {admins.map((a) => (
            <tr key={a._id} className="border-t">
              <td>{a.firstName} {a.lastName}</td>
              <td>{a.email}</td>
              <td>{a.type}</td>
              <td>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
