// // Geocoding service using Mapbox API
// const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

// export const geocodeAddress = async (address) => {
//   try {
//     const response = await fetch(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//         address
//       )}.json?access_token=${MAPBOX_API_KEY}&limit=1`
//     );
    
//     if (!response.ok) {
//       throw new Error('Geocoding request failed');
//     }
    
//     const data = await response.json();
    
//     if (data.features && data.features.length > 0) {
//       const [longitude, latitude] = data.features[0].center;
//       return { latitude, longitude };
//     }
    
//     throw new Error('Address not found');
//   } catch (error) {
//     console.error('Geocoding error:', error);
//     // Return default coordinates if geocoding fails
//     return { latitude: 22.5726, longitude: 88.3639 }; // Default to Kolkata
//   }
// };

// export const reverseGeocode = async (latitude, longitude) => {
//   try {
//     const response = await fetch(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_API_KEY}&limit=1`
//     );
    
//     if (!response.ok) {
//       throw new Error('Reverse geocoding request failed');
//     }
    
//     const data = await response.json();
    
//     if (data.features && data.features.length > 0) {
//       return data.features[0].place_name;
//     }
    
//     throw new Error('Location not found');
//   } catch (error) {
//     console.error('Reverse geocoding error:', error);
//     return 'Unknown location';
//   }
// };
