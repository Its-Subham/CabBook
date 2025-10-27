import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import LiveRouteTracking from "../components/LiveRouteTracking";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Riding = () => {
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const location = useLocation();
  const { ride } = location.state;
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const detailsPanelRef = useRef(null);
  const [detailsPanel, setDetailsPanel] = useState(false);

  console.log("Riding-Component", ride);

  socket.on("ride-ended", () => {
    navigate("/home");
  });

  useGSAP(
    function () {
      if (detailsPanel) {
        gsap.to(detailsPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(detailsPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [detailsPanel]
  );

  return (
    <div className="h-screen relative flex flex-col justify-end overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between bg-transparent">
        <div className="text-2xl font-bold">CabBook</div>
        <Link
          to="/home"
          className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-20 shadow-lg"
        >
          <i className="text-lg font-medium ri-home-5-line"></i>
        </Link>
      </div>

      <div
        className="h-auto min-h-[20vh] p-6 flex items-center justify-between relative bg-yellow-400 pt-10 z-10 cursor-pointer"
        onClick={() => {
          setDetailsPanel(true);
        }}
      >
        <h5 className="p-1 text-center w-full absolute top-0 left-0">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <div className="flex w-full items-center justify-between gap-3 sm:gap-6">
          <div className="flex flex-col items-start flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-road-map-line text-xl text-gray-700"></i>
              <h4 className="text-lg sm:text-xl font-semibold truncate">{`${distance} km away`}</h4>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-xl text-gray-700"></i>
              <h4 className="text-lg sm:text-xl font-semibold truncate">{`${duration} mins`}</h4>
            </div>
          </div>
          <button className="bg-black text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base whitespace-nowrap flex-shrink-0">
            Ride Details
          </button>
        </div>
      </div>

      {detailsPanel && (
        <div
          className="fixed inset-0 z-[400] bg-black bg-opacity-30"
          onClick={() => setDetailsPanel(false)}
        ></div>
      )}

      <div
        ref={detailsPanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12 max-h-[80vh] overflow-y-auto"
      >
        <h5
          className="p-1 text-center w-full absolute top-0 left-0 cursor-pointer"
          onClick={() => setDetailsPanel(false)}
        >
          <i className="text-3xl text-gray-800 ri-arrow-down-wide-line"></i>
        </h5>
        <div className="flex items-center justify-between mb-5">
          <img
            className="h-14 w-fit rounded-md object-cover"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt="Captain"
          />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.captain.fullname.firstname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain.vehicle.plate}
            </h4>
            <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="w-full">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium">Destination Location</h3>
                <p className="text-sm -mt-1 text-gray-600 break-words">
                  {ride?.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="text-lg ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                <p className="text-sm -mt-1 text-gray-600">Amount: Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition-colors">
          Make a Payment
        </button>
      </div>

      <div className="fixed inset-0 z-0">
        {ride.status === "ongoing" ? (
          <LiveRouteTracking
            ride={ride}
            setDistance={setDistance}
            setDuration={setDuration}
          />
        ) : (
          <LiveTracking />
        )}
      </div>
    </div>
  );
};

export default Riding;
