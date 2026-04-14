import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navbar from "../../components/Navbar";
import DriverDashboard from "../DriverDashboard";

export default function TruckDashboard() {
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar companyName="Company Name" onLogout={handleLogout} />
      
      <div className="flex-1 overflow-hidden">
        <DriverDashboard />
      </div>
    </div>
  );
}