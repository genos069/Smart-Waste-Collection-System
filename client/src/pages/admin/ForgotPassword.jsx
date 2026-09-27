import { useState } from "react";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await forgotPassword(email);

      setMsg(data.resetToken ? `${data.message} Development token: ${data.resetToken}` : data.message);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Forgot Password</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="bg-blue-500 text-white p-2">
          Send Reset Token
        </button>
      </form>

      {msg && <p className="mt-2 text-green-600">{msg}</p>}
    </div>
  );
}
