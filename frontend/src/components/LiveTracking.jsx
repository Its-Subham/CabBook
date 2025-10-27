// import React, { useState, useEffect } from 'react'
// import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

// const containerStyle = {
//     width: '100%',
//     height: '100%',
// };

// const center = {
//     lat: -3.745,
//     lng: -38.523
// };

// const LiveTracking = () => {
//     const [ currentPosition, setCurrentPosition ] = useState(center);

//     useEffect(() => {
//         navigator.geolocation.getCurrentPosition((position) => {
//             const { latitude, longitude } = position.coords;
//             setCurrentPosition({
//                 lat: latitude,
//                 lng: longitude
//             });
//         });

//         const watchId = navigator.geolocation.watchPosition((position) => {
//             const { latitude, longitude } = position.coords;
//             setCurrentPosition({
//                 lat: latitude,
//                 lng: longitude
//             });
//         });

//         return () => navigator.geolocation.clearWatch(watchId);
//     }, []);

//     useEffect(() => {
//         const updatePosition = () => {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 const { latitude, longitude } = position.coords;

//                 console.log('Position updated:', latitude, longitude);
//                 setCurrentPosition({
//                     lat: latitude,
//                     lng: longitude
//                 });
//             });
//         };

//         updatePosition(); // Initial position update

//         const intervalId = setInterval(updatePosition, 1000); // Update every 10 seconds

//     }, []);

//     return (
//         <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={currentPosition}
//                 zoom={15}
//             >
//                 <Marker position={currentPosition} />
//             </GoogleMap>
//         </LoadScript>
//     )
// }

// export default LiveTracking






import React, { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const LiveTracking = () => {
  const [viewport, setViewport] = useState({
    latitude: 22.5726, // Default (Kolkata)
    longitude: 88.3639,
    zoom: 15,
    width: "100%",
    height: "100%", // Changed from "100vh" to "100%"
  });

  const [currentPosition, setCurrentPosition] = useState({
    lat: 22.5726,
    lng: 88.3639,
  });

  useEffect(() => {
    // Get initial position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updatePosition(latitude, longitude);
        },
        (error) => {
          console.error("Error getting initial position:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );

      // Watch position changes
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updatePosition(latitude, longitude);
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const updatePosition = (latitude, longitude) => {
    setCurrentPosition({ lat: latitude, lng: longitude });

    // Smooth transition for viewport (camera movement)
    setViewport((prev) => ({
      ...prev,
      latitude,
      longitude,
      transitionDuration: 1000, // 1 second smooth movement
    }));
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        {...viewport}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {/* Blue dot marker */}
        <Marker 
          latitude={currentPosition.lat} 
          longitude={currentPosition.lng}
          anchor="center"
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              background: "#007AFF", // iOS blue
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          />
        </Marker>
      </Map>
    </div>
  );
};

export default LiveTracking;
