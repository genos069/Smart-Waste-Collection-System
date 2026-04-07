import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function TruckDashboard() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* Top Right Logo */}
      <div
        className="fixed top-6 right-6 z-50"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white text-lg font-semibold cursor-pointer shadow-lg">
          A
        </div>

        {/* Hover Menu (Google Style) */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl p-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600 truncate">
                  aurorajohnson.0995@gmail.com
                </p>
                <X className="w-4 h-4 cursor-pointer" />
              </div>

              {/* Profile */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-800 text-white rounded-full flex items-center justify-center text-2xl mb-2">
                  A
                </div>
                <p className="text-lg font-medium">Hi, Aurora!</p>
              </div>

              {/* Manage Account */}
              <div className="mt-4">
                <button className="w-full border rounded-full py-2 text-sm hover:bg-gray-100">
                  Manage your Google Account
                </button>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2">
                <button className="flex-1 bg-gray-100 py-2 rounded-lg text-sm hover:bg-gray-200">
                  + Add account
                </button>
                <button className="flex-1 bg-gray-100 py-2 rounded-lg text-sm hover:bg-gray-200">
                  Sign out
                </button>
              </div>

              {/* Footer */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                Privacy Policy • Terms of Service
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Large Container */}
      <div className="bg-white rounded-2xl shadow-md min-h-[90vh] flex items-center justify-center text-gray-400">
        Main Content Area (Almost Full Screen)
      </div>

      {/* Truck Details Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Truck Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Truck Number</p>
            <p className="font-medium">OD-02-AB-1234</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Driver Name</p>
            <p className="font-medium">Ramesh Kumar</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Current Location</p>
            <p className="font-medium">Bhubaneswar</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium text-green-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
