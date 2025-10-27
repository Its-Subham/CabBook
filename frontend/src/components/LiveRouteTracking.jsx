import { useState, useEffect, useRef, useCallback } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import PropTypes from "prop-types";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;
mapboxgl.accessToken = MAPBOX_TOKEN || "";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const LiveRouteTracking = ({ ride, setDistance, setDuration }) => {
  const initialViewStateRef = useRef({
    latitude: 22.5726, // Default: Kolkata
    longitude: 88.3639,
    zoom: 12,
  });

  const [captainLocation, setCaptainLocation] = useState(null); // [lng, lat]
  const [route, setRoute] = useState(null); // GeoJSON
  const prevLocationRef = useRef(null);
  const mapRef = useRef(null);

  // Fetch route from backend
  const fetchRoute = async (from, destination) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/maps/get-route`, {
        params: {
          "currentLocation[ltd]": from[1],
          "currentLocation[lng]": from[0],
          destination,
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = res.data;
      setDistance(parseFloat((data.distance / 1000).toFixed(2)));
      setDuration(parseFloat((data.duration / 60).toFixed(2)));

      console.log("🗺 Route data:", data);

      if (data?.geometry?.coordinates?.length) {
        const validCoords = data.geometry.coordinates.filter(
          (coord) =>
            Array.isArray(coord) &&
            coord.length === 2 &&
            typeof coord[0] === "number" &&
            typeof coord[1] === "number"
        );

        if (!validCoords.length) return;

        setRoute({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: validCoords,
          },
        });

        // Fit bounds
        if (mapRef.current) {
          const map = mapRef.current.getMap();
          const [minLng, minLat, maxLng, maxLat] = validCoords.reduce(
            ([minLng, minLat, maxLng, maxLat], [lng, lat]) => [
              Math.min(minLng, lng),
              Math.min(minLat, lat),
              Math.max(maxLng, lng),
              Math.max(maxLat, lat),
            ],
            [
              validCoords[0][0],
              validCoords[0][1],
              validCoords[0][0],
              validCoords[0][1],
            ]
          );

          map.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            { padding: 60, duration: 800 }
          );
        }
      }
    } catch (err) {
      console.error("❌ Error fetching route:", err);
      setRoute(null);
    }
  };

  // Poll captain location
  const updateCaptainLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error("❌ Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = [longitude, latitude];

        const prev = prevLocationRef.current;
        const movedEnough =
          !prev ||
          Math.abs(prev[0] - newLoc[0]) >= 0.0001 ||
          Math.abs(prev[1] - newLoc[1]) >= 0.0001;

        if (!movedEnough) return;

        setCaptainLocation(newLoc);
        prevLocationRef.current = newLoc;

        if (!route && mapRef.current) {
          const map = mapRef.current.getMap();
          map?.easeTo({ center: [longitude, latitude], duration: 500 });
        }

        if (ride?.destination) {
          await fetchRoute(newLoc, ride.destination);
        }
      },
      (error) => {
        console.error("❌ Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, [ride?.destination, route]);

  // Start tracking
  useEffect(() => {
    let intervalId;
    (async () => {
      await updateCaptainLocation();
      intervalId = setInterval(updateCaptainLocation, 30000);
    })();
    return () => intervalId && clearInterval(intervalId);
  }, [updateCaptainLocation]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialViewStateRef.current}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        interactive={true}
        dragPan={true}
        dragRotate={true}
        scrollZoom={true}
        doubleClickZoom={true}
        touchZoomRotate={true}
        touchPitch={true}
        keyboard={true}
        minZoom={2}
        maxZoom={20}
      >
        {/* Captain marker */}
        {captainLocation && (
          <Marker longitude={captainLocation[0]} latitude={captainLocation[1]}>
            <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg" />
          </Marker>
        )}

        {/* Route layer */}
        {route && (
          <Source id="route" type="geojson" data={route}>
            <Layer
              id="route-line"
              type="line"
              source="route"
              layout={{ "line-join": "round", "line-cap": "round" }}
              paint={{ "line-color": "#3b82f6", "line-width": 4 }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

LiveRouteTracking.propTypes = {
  ride: PropTypes.shape({
    destination: PropTypes.string.isRequired,
  }),
};

export default LiveRouteTracking;
