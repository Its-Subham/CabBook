import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CapatainContext";
import LiveTracking from "../components/LiveTracking";
import axios from "axios";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  // console.log("CaptainHome-Component", captain);

  useEffect(() => {
    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });

    // Check current online status
    checkOnlineStatus();

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    updateLocation();
    const locationInterval = setInterval(updateLocation, 10000);

    return () => clearInterval(locationInterval);
  }, []);

  const checkOnlineStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsOnline(response.data.isOnline);
    } catch (error) {
      console.error("Error checking online status:", error);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      if (isOnline) {
        // Go offline
        console.log("Going offline...");
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/captains/session/end`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Offline response:", response.data);
        setIsOnline(false);
      } else {
        // Go online
        console.log("Going online...");
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/captains/session/start`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Online response:", response.data);
        setIsOnline(true);
      }

      // Small delay to ensure backend has processed the update
      setTimeout(() => {
        // Trigger refresh of CaptainDetails component
        setRefreshTrigger((prev) => prev + 1);
      }, 500);
    } catch (error) {
      console.error("Error toggling online status:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  socket.on("new-ride", (data) => {
    setRide(data);
    setRidePopupPanel(true);
  });

  async function confirmRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="h-screen">
      <div className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between bg-transparent">
        <div className="text-2xl font-bold">CabBook</div>

        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <LiveTracking />
      </div>
      <div className="h-2/5 p-6">
        {/* Online/Offline Toggle Button */}
        <div className="mb-4 flex justify-center">
          <button
            onClick={toggleOnlineStatus}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isOnline
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>
        <CaptainDetails refreshTrigger={refreshTrigger} />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          // captain={captain}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
