import { useState } from "react";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const [form, setForm] = useState({
    token: "",
    newPassword: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await resetPassword(form);

      setMsg(data.message);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Reset Password</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
        <input
          name="token"
          placeholder="Reset Token"
          onChange={handleChange}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
        />

        <button className="bg-green-500 text-white p-2">
          Reset Password
        </button>
      </form>

      {msg && <p className="mt-2 text-blue-600">{msg}</p>}
    </div>
  );
}
