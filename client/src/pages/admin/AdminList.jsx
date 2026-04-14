import { useEffect, useState } from "react";
import { getAdmins, deleteAdmin } from "../../services/adminApi";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    const res = await getAdmins();
    const data = await res.json();
    setAdmins(data.data || []);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    await deleteAdmin(id);
    fetchAdmins();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admins</h2>

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