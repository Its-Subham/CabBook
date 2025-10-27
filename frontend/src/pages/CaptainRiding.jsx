import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiveTracking from "../components/LiveTracking";
import LiveRouteTracking from "../components/LiveRouteTracking";
// import {CaptainDataContext} from '../context/CapatainContext'

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  // console.log("CaptainRiding-Location", location);
  // const  {captain}  = useContext(CaptainDataContext);
  // console.log("CaptainRiding-Captain", captain);
  const rideData = location.state?.ride;
  // const captainData = location.state?.captain

  // console.log("CaptainRiding-Captain-m", captainData);

  console.log("CaptainRiding-Component", rideData);
  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  return (
    <div className="h-screen relative flex flex-col justify-end">
      <div className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between bg-transparent">
        <div className="text-2xl font-bold">CabBook</div>

        {/* <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link> */}
      </div>

      <div
        className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10 z-10"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5
          className="p-1 text-center w-[90%] absolute top-0"
          onClick={() => {}}
        >
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <div className="flex w-full items-center justify-between gap-3 sm:gap-6 px-2 sm:px-0">
          <div className="flex flex-col items-start flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <i className="ri-road-map-line text-xl text-gray-700"></i>
              <h4 className="text-lg sm:text-xl font-semibold truncate">{`${distance} km away`}</h4>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-xl text-gray-700"></i>
              <h4 className="text-lg sm:text-xl font-semibold truncate">{`${duration} mins`}</h4>
            </div>
          </div>
          <button
            className="bg-green-600 text-white font-semibold py-2 px-4 sm:py-3 sm:px-10 rounded-lg text-sm sm:text-lg whitespace-nowrap flex-shrink-0"
            style={{ minWidth: "110px" }}
          >
            Complete Ride
          </button>
        </div>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide
          ride={rideData}
          setFinishRidePanel={setFinishRidePanel}
          distance={distance}
        />
      </div>

      <div className="absolute inset-0 z-0">
        {rideData?.status === "ongoing" ? (
          <LiveRouteTracking
            ride={rideData}
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

export default CaptainRiding;
