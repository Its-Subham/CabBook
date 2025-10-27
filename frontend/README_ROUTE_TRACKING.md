# Live Route Tracking Feature

This feature provides real-time route tracking with dynamic route visualization based on the ride status. The system tracks the captain's GPS location and displays optimized routes to guide both the captain and user during the ride.

## Ride Flow & Route States

### 1. **New Ride Request** (Status: `pending`)
- Captain receives a new ride request via Socket.IO
- Shows ride details in popup (pickup, destination, fare)
- No route displayed yet - only markers shown
- Captain can see pickup and destination locations

### 2. **Ride Confirmed** (Status: `confirmed`)
- Captain accepts the ride request
- Ride gets assigned to the captain
- **Route displayed**: Captain's current location → Pickup location
- **Route color**: Blue line (`#3b82f6`)
- Shows distance and estimated travel time to pickup point
- Real-time captain tracking begins

### 3. **Ride Started** (Status: `ongoing`)
- Captain arrives at pickup location
- User provides OTP for verification
- Captain enters OTP and clicks "Confirm & Start Ride"
- Route changes from pickup to destination
- **Route displayed**: Pickup location → Destination location
- **Route color**: Blue line (`#3b82f6`)
- Shows distance and estimated travel time to destination
- Both user and captain can track the ride in real-time

### 4. **Ride Completed** (Status: `completed`)
- Captain ends the ride at destination
- Route display is hidden
- Fare calculation is finalized
- Ride statistics are updated

## Features

- **Real-time GPS tracking**: Continuously tracks the captain's current position
- **Dynamic route visualization**: Updates route based on ride status (confirmed → ongoing)
- **Live location updates**: Updates every 30 seconds automatically
- **Location markers**: 
  - 🔵 Blue marker: Captain's current position (blue circle with white border)
  - 🟢 Green marker: Pickup location (if ride is confirmed)
  - 🔴 Red marker: Destination location
- **Route information**: Shows distance (in km) and duration (in minutes)
- **Status-based rendering**: Route only displays when ride status is `ongoing`
- **Automatic geocoding**: Converts addresses to coordinates using Mapbox Geocoding API
- **Map auto-fit**: Automatically adjusts map bounds to show entire route

## Route States

### Route to Pickup (Blue Line)
- **When**: Ride status changes to `confirmed`
- **From**: Captain's current location (GPS)
- **To**: User's pickup location
- **Purpose**: Guide captain to pickup the user
- **Update frequency**: Every 30 seconds or when captain moves significantly

### Route to Destination (Blue Line)
- **When**: Ride status is `ongoing`
- **From**: Pickup location (after OTP verification)
- **To**: User's destination
- **Purpose**: Guide captain to drop off the user
- **Update frequency**: Every 30 seconds or when captain moves significantly

## Component Details

### LiveRouteTracking

The main component that handles real-time route tracking:

**Props:**
- `ride`: Object containing ride details (must include `destination`)
- `setDistance`: Callback function to update distance state
- `setDuration`: Callback function to update duration state

**Features:**
- Map display using React Map GL (Mapbox)
- Dynamic route calculation based on ride status
- Real-time GPS location tracking
- Location markers for captain, pickup, and destination
- Route line visualization
- Automatic map bounds adjustment

### Usage

```jsx
import LiveRouteTracking from '../components/LiveRouteTracking';

// In your component (Captain or User view)
<LiveRouteTracking 
  ride={rideData}  // Must have destination property
  setDistance={setDistance}  // Callback for distance updates
  setDuration={setDuration}  // Callback for duration updates
/>
```

**Example Usage in Captain Component:**
```jsx
{rideData?.status === "ongoing" ? (
  <LiveRouteTracking
    ride={rideData}
    setDistance={setDistance}
    setDuration={setDuration}
  />
) : (
  <LiveTracking />  // Basic tracking when not in-progress
)}
```

## Ride Status Flow

```
pending → confirmed → ongoing → completed
   ↓         ↓          ↓          ↓
  Show     Route to   Route to   No
  Popup    Pickup     Destination Route
           (Blue)     (Blue)
```

- **pending**: Ride request created, waiting for captain acceptance
- **confirmed**: Captain accepted ride, navigating to pickup
- **ongoing**: Ride started with OTP, navigating to destination
- **completed**: Ride ended at destination

## API Integration

### Backend Endpoints Used

- **POST /rides/create** - Create new ride request
- **POST /rides/confirm** - Captain confirms/accepts ride
- **GET /rides/start-ride** - Start ride with OTP verification
- **POST /rides/end-ride** - End completed ride
- **GET /maps/get-route** - Get route from current location to destination

### Request Format for Route API

```javascript
GET /maps/get-route?currentLocation[ltd]=latitude&currentLocation[lng]=longitude&destination=address
```

**Response:**
```json
{
  "geometry": {
    "coordinates": [[lng, lat], [lng, lat], ...],
    "type": "LineString"
  },
  "distance": 5000,  // in meters
  "duration": 1800   // in seconds
}
```

## Environment Variables

Required environment variables:
```env
VITE_MAPBOX_API_KEY=your_mapbox_access_token
VITE_BASE_URL=http://localhost:3000
```

## Real-time Socket Events

### Events Received

#### `new-ride`
Emitted to captains when a new ride is created in their area.
```javascript
socket.on('new-ride', (rideData) => {
  // Show ride popup to captain
  setRide(rideData);
  setRidePopupPanel(true);
});
```

#### `ride-confirmed`
Emitted to the user when a captain confirms their ride.
```javascript
socket.on('ride-confirmed', (ride) => {
  setRide(ride);
  setWaitingForDriver(false);
  navigate('/riding', { state: { ride } });
});
```

#### `ride-started`
Emitted to the user when the captain starts the ride.
```javascript
socket.on('ride-started', (ride) => {
  // Update UI to show route tracking
  setRide(ride);
});
```

#### `ride-ended`
Emitted to the user when the ride is completed.
```javascript
socket.on('ride-ended', () => {
  navigate('/home');
});
```

### Events Emitted

#### `update-location-captain`
Updates captain's location every 10 seconds
```javascript
socket.emit('update-location-captain', {
  userId: captain._id,
  location: {
    ltd: position.coords.latitude,
    lng: position.coords.longitude
  }
});
```

#### `ride-status-updated`
Notifies about ride status changes
```javascript
socket.emit('ride-status-updated', updatedRide);
```

## Geolocation Handling

### GPS Tracking

- **Update frequency**: Every 30 seconds for route updates
- **Accuracy**: High accuracy enabled
- **Timeout**: 10 seconds
- **Cache**: Maximum age of 30 seconds

### Fallback Behavior

- If geolocation fails, default coordinates (Kolkata: 22.5726°N, 88.3639°E) are used
- If route calculation fails, map still displays markers but no route line
- Error logging occurs in console for debugging

## Styling

### Map Styling
- **Map style**: `mapbox://styles/mapbox/streets-v11`
- **Route color**: Blue (`#3b82f6`)
- **Line width**: 4px
- **Line join**: Round
- **Line cap**: Round

### Marker Styling
- **Captain location**: Blue circle (4x4) with white border and shadow
- **Pickup location**: Green circle (if implemented)
- **Destination**: Red circle (if implemented)

### Overlay Styling
- **Distance display**: Shows kilometers (2 decimal places)
- **Duration display**: Shows minutes (2 decimal places)
- **Font**: Inherited from Tailwind CSS

## Browser Compatibility

**Requirements:**
- Modern browser with Geolocation API support
- Internet connection for Mapbox API calls
- HTTPS connection (required for geolocation in production)

**Tested Browsers:**
- Chrome/Edge (Chromium) - ✅ Full support
- Firefox - ✅ Full support
- Safari - ✅ Full support (iOS 12+)
- Mobile browsers - ✅ Supported with location permissions

## Error Handling

### Common Errors & Solutions

1. **Geolocation not supported**
   - User's browser doesn't support geolocation
   - Fallback to default coordinates

2. **Permission denied**
   - User denied location permission
   - Prompt user to enable location services

3. **Route calculation failed**
   - Invalid addresses or API error
   - Show markers without route line

4. **OTP verification failed**
   - Invalid or expired OTP
   - Display error message to captain

## Performance Optimization

- **Debounced location updates**: Only updates when captain moves significantly (>0.0001 degrees)
- **Efficient re-renders**: Uses React hooks and refs to minimize re-renders
- **Memory management**: Clears intervals and event listeners on unmount
- **Lazy route fetching**: Only fetches route when needed
- **Cached coordinates**: Stores previous location to avoid unnecessary updates

## Troubleshooting

### Route Not Displaying
1. Check ride status is `ongoing`
2. Verify Mapbox API key is set correctly
3. Check browser console for errors
4. Ensure captain location is being tracked

### Location Not Updating
1. Verify browser location permissions
2. Check device GPS is enabled
3. Ensure secure context (HTTPS in production)

### API Errors
1. Check backend server is running
2. Verify authentication token is valid
3. Check network connectivity
4. Review API endpoint URLs

---

**Note**: This feature requires active location services and internet connectivity to function properly. All location data is handled securely and in compliance with privacy regulations.
