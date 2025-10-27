const axios = require('axios');
const captainModel = require('../models/captain.model');

// module.exports.getAddressCoordinate = async (address) => {
//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey};

//     try {
//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {
//             const location = response.data.results[ 0 ].geometry.location;
//             return {
//                 ltd: location.lat,
//                 lng: location.lng
//             };
//         } else {
//             throw new Error('Unable to fetch coordinates');
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.MAPBOX_API_KEY;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${apiKey}&limit=1`;

    try {
        const response = await axios.get(url);
        if (response.data.features && response.data.features.length > 0) {
            const location = response.data.features[0].center;
            return {
                ltd: location[1], // lat
                lng: location[0]  // lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// module.exports.getDistanceTime = async (origin, destination) => {
//     if (!origin || !destination) {
//         throw new Error('Origin and destination are required');
//     }

//     const apiKey = process.env.GOOGLE_MAPS_API;

//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//     try {


//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {

//             if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
//                 throw new Error('No routes found');
//             }

//             return response.data.rows[ 0 ].elements[ 0 ];
//         } else {
//             throw new Error('Unable to fetch distance and time');
//         }

//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.MAPBOX_API_KEY;

    // Get coordinates for both locations
    const originCoords = await geocode(origin, apiKey);
    const destCoords = await geocode(destination, apiKey);

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords};${destCoords}?access_token=${apiKey}`;

    try {
        const response = await axios.get(url);
        
        if (response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            
            if (!route || route.distance === undefined) {
                throw new Error('No routes found');
            }

            // Return in same format as Google Maps
            return {
                distance: {
                    text: `${(route.distance / 1000).toFixed(1)} km`,
                    value: Math.round(route.distance)
                },
                duration: {
                    text: `${Math.round(route.duration / 60)} mins`,
                    value: Math.round(route.duration)
                },
                status: 'OK'
            };
        } else {
            throw new Error('No routes found');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function geocode(location, apiKey) {
    // Check if input is already coordinates (both numbers)
    const parts = location.split(',').map(p => p.trim());
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return `${parts[0]},${parts[1]}`;
    }

    // Otherwise, use Mapbox Geocoding API
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${apiKey}&limit=1`;
    
    const response = await axios.get(geocodeUrl);

    if (response.data.features && response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].center;
        return `${lng},${lat}`;
    }

    throw new Error(`Could not find coordinates for: ${location}`);
}




// module.exports.getAutoCompleteSuggestions = async (input) => {
//     if (!input) {
//         throw new Error('query is required');
//     }

//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {
//             return response.data.predictions.map(prediction => prediction.description).filter(value => value);
//         } else {
//             throw new Error('Unable to fetch suggestions');
//         }
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }


module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const apiKey = process.env.MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    input
  )}.json?access_token=${apiKey}&autocomplete=true&limit=5`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.features) {
      // Extract place names (similar to Google description)
      return response.data.features
        .map((feature) => feature.place_name)
        .filter((value) => value);
    } else {
      throw new Error("Unable to fetch suggestions");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;
}


module.exports.getRoute = async (currentLocation, destinationCoords) => {
    if (!currentLocation || !destinationCoords) {
        throw new Error('Current location and destination are required');
    }

    // Validate that the coordinate objects have the required properties
    if (!currentLocation.ltd || !currentLocation.lng || 
        !destinationCoords.ltd || !destinationCoords.lng) {
        throw new Error('Coordinates must have lat and lng properties');
    }

    const apiKey = process.env.MAPBOX_API_KEY;

    // Convert coordinate objects to the format required by Mapbox API (lng,ltd)
    const currentCoords = `${currentLocation.lng},${currentLocation.ltd}`;
    const destinationCoordsStr = `${destinationCoords.lng},${destinationCoords.ltd}`;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${currentCoords};${destinationCoordsStr}?geometries=geojson&access_token=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.routes && response.data.routes.length > 0) {
            return response.data.routes[0];
        }

        throw new Error('No route found');
    } catch (error) {
        console.error('Error fetching route:', error.message);
        throw error;
    }
}