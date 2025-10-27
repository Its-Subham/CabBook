// components/Loading.jsx
import React, { useEffect, useState } from "react";

const Loading = () => {
  const [activeLight, setActiveLight] = useState(null);

  useEffect(() => {
    const sequence = ["red", "yellow", "green"];
    let i = 0;
    const interval = setInterval(() => {
      setActiveLight(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
        <div className="w-16 h-48 flex flex-col justify-between items-center p-2 bg-gray-800 rounded-lg">
          <div
            className={`w-12 h-12 rounded-full transition-colors duration-300 ${
              activeLight === "red" ? "bg-red-500" : "bg-gray-400"
            }`}
          />
          <div
            className={`w-12 h-12 rounded-full transition-colors duration-300 ${
              activeLight === "yellow" ? "bg-yellow-400" : "bg-gray-400"
            }`}
          />
          <div
            className={`w-12 h-12 rounded-full transition-colors duration-300 ${
              activeLight === "green" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <p className="mt-4 text-gray-700 font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
