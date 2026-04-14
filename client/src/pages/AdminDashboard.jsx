import { useNavigate } from "react-router-dom";
import { Trash2, Users, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import BinMap from "../components/BinMap";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">

        <Navbar />

        <div className="flex h-full bg-white  overflow-hidden">

          <aside className="w-56 shrink-0 bg-black border-r border-gray-700 flex flex-col py-6 px-4 gap-2">

            <div className="flex items-center gap-2 mb-6 px-2">

              <span className="text-2xl">♻️</span>

              <span className="font-bold text-green-700 dark:text-green-400 text-sm leading-tight">
                Admin Panel
              </span>

            </div>

            <NavItem icon={<MapPin className="w-4 h-4" />} label="Live Map" active />

            <NavItem
              icon={<Users className="w-4 h-4" color="green" />}
              label="Create Users"
              onClick={() => navigate("/create-users")}
            />

            <NavItem
              icon={<Trash2 className="w-4 h-4" color="green" />}
              label="Add Bin"
              onClick={() => navigate("/admin-map")}
            />

            <NavItem
              icon={<Trash2 className="w-4 h-4" color="red" />}
              label="Delete Bin"
              onClick={() => navigate("/all-bins")}
            />

            <NavItem
              icon={<Trash2 className="w-4 h-4" color="red" />}
              label="Delete User"
              onClick={() => navigate("/user-list")}
            />

          </aside>

          <div className="flex-1 flex flex-col overflow-hidden">

            <div className="flex-1 px-4 pb-4 overflow-hidden">

              <div className="h-full bg-white shadow-md overflow-hidden relative">

                <div className="absolute top-0 left-0 right-0 z-[500] bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm">

                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    ©️ Smart Waste Collection System
                  </span>

                </div>

                <div className="h-screen flex flex-col overflow-hidden">
                  <BinMap />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

function NavItem({ icon, label, onClick, active = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors w-full text-left ${active
        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
    >
      {icon}
      {label}
    </button>

  );
}
