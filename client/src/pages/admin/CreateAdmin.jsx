import { useState } from "react";
import { createAdmin } from "../../services/adminApi";

export default function CreateAdmin() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    type: "admin",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await createAdmin(form);
    const data = await res.json();

    alert(data.message || "User created");

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      type: "admin",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-2">
      <input name="firstName" placeholder="First Name" onChange={handleChange} />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <select name="type" onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="driver">Driver</option>
      </select>

      <button className="bg-green-500 text-white p-2">
        Create Admin
      </button>
    </form>
  );
}