import { LogOut } from "lucide-react";
import Bin from "../assets/bin.svg";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    const handleLogout = async () => {
        console.log('Logout clicked');
        try {
            await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                credentials: "include", //
            });

            // ✅ clear user from context
            setUser(null);

            // ✅ redirect to login
            navigate("/login");

        } catch (err) {
            console.error("Logout failed");
        }
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-screen mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <img
                                src={Bin}
                                alt="Bin"
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        <span className="font-semibold text-xl text-gray-900">
                            Smart Waste Collection System
                        </span>
                    </div>
                    <div style={{ paddingRight:"28px" }}>
                        <button
                        style={{padding: "8px 15px 9px 8px"}}
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md border border-red-400 hover:bg-red-700 transition-all"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}