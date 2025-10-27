import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] relative"
    >
      {/* Top Left Title */}
      <div className="absolute top-6 left-6 text-2xl font-bold text-white drop-shadow-lg">
        CabBook
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl p-6">
        <h2 className="text-[28px] font-semibold mb-4">
          Get Started with CabBook
        </h2>
        <Link
          to="/login"
          className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg text-lg font-medium"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;
