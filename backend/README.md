# Backend API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in one of the following ways:

- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `token=<token>`

---

## User Endpoints

### Register User

Register a new user account.

**Endpoint:** `POST /users/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `fullname.firstname`: Minimum 3 characters
- `password`: Minimum 6 characters

**Response:** `201 Created`
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

---

### Login User

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /users/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Minimum 6 characters

**Response:** `200 OK`
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

---

### Get User Profile

Get the authenticated user's profile information.

**Endpoint:** `GET /users/profile`

**Authentication:** Required (User)

**Response:** `200 OK`
```json
{
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

---

### Logout User

Logout the current user and blacklist the JWT token.

**Endpoint:** `GET /users/logout`

**Authentication:** Required (User)

**Response:** `200 OK`
```json
{
  "message": "Logout successfully"
}
```

---

## Captain Endpoints

### Register Captain

Register a new captain (driver) account with vehicle information.

**Endpoint:** `POST /captains/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `fullname.firstname`: Minimum 3 characters
- `password`: Minimum 6 characters
- `vehicle.color`: Minimum 3 characters
- `vehicle.plate`: Minimum 3 characters
- `vehicle.capacity`: Must be a number, minimum 1
- `vehicle.vehicleType`: Must be one of: `'car'`, `'motorcycle'`, `'auto'`

**Response:** `201 Created`
```json
{
  "token": "jwt_token_here",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

### Login Captain

Authenticate a captain and receive a JWT token.

**Endpoint:** `POST /captains/login`

**Authentication:** Required (Captain)

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Minimum 6 characters

**Response:** `200 OK`
```json
{
  "token": "jwt_token_here",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

### Get Captain Profile

Get the authenticated captain's profile information.

**Endpoint:** `GET /captains/profile`

**Authentication:** Required (Captain)

**Response:** `200 OK`
```json
{
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

### Logout Captain

Logout the current captain and blacklist the JWT token.

**Endpoint:** `GET /captains/logout`

**Authentication:** Required (Captain)

**Response:** `200 OK`
```json
{
  "message": "Logout successfully"
}
```

---

### Get Captain Statistics

Get statistics for the authenticated captain including earnings, ride counts, hours worked, etc.

**Endpoint:** `GET /captains/stats`

**Authentication:** Required (Captain)

**Response:** `200 OK`
```json
{
  "totalRides": 150,
  "totalEarnings": 45000,
  "dailyHours": 8,
  "totalHours": 200,
  "averageRating": 4.8,
  "status": "online"
}
```

---

### Start Captain Session

Start a captain session (go online). This marks the captain as available for rides.

**Endpoint:** `POST /captains/session/start`

**Authentication:** Required (Captain)

**Response:** `200 OK`
```json
{
  "message": "Session started successfully",
  "captain": {
    "_id": "captain_id",
    "status": "online",
    "sessionStartTime": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### End Captain Session

End a captain session (go offline). This calculates the daily and total hours worked.

**Endpoint:** `POST /captains/session/end`

**Authentication:** Required (Captain)

**Response:** `200 OK`
```json
{
  "message": "Session ended successfully",
  "captain": {
    "_id": "captain_id",
    "status": "offline",
    "dailyHours": 8,
    "totalHours": 208
  }
}
```

---

## Maps Endpoints

### Get Coordinates

Get the latitude and longitude coordinates for a given address.

**Endpoint:** `GET /maps/get-coordinates`

**Authentication:** Required (User)

**Query Parameters:**
- `address` (string, required): The address to geocode

**Example:**
```
GET /maps/get-coordinates?address=New+York,NY
```

**Response:** `200 OK`
```json
{
  "ltd": 40.7128,
  "lng": -74.0060
}
```

---

### Get Distance and Time

Calculate the distance and estimated travel time between two locations.

**Endpoint:** `GET /maps/get-distance-time`

**Authentication:** Required (User)

**Query Parameters:**
- `origin` (string, required): The starting address
- `destination` (string, required): The destination address

**Example:**
```
GET /maps/get-distance-time?origin=New+York,NY&destination=Los+Angeles,CA
```

**Response:** `200 OK`
```json
{
  "distance": {
    "text": "2,789 miles",
    "value": 4486540
  },
  "duration": {
    "text": "1 day 18 hours",
    "value": 154800
  }
}
```

---

### Get Autocomplete Suggestions

Get address autocomplete suggestions based on user input.

**Endpoint:** `GET /maps/get-suggestions`

**Authentication:** Required (User)

**Query Parameters:**
- `input` (string, required): The input string (minimum 3 characters)

**Example:**
```
GET /maps/get-suggestions?input=1600+Amphitheatre
```

**Response:** `200 OK`
```json
[
  "1600 Amphitheatre Parkway, Mountain View, CA, USA",
  "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
]
```

---

### Get Route

Get the route from current location to destination. This is primarily used by captains for navigation.

**Endpoint:** `GET /maps/get-route`

**Authentication:** Required (Captain)

**Query Parameters:**
- `currentLocation.ltd` (float, required): Current latitude (-90 to 90)
- `currentLocation.lng` (float, required): Current longitude (-180 to 180)
- `destination` (string, required): The destination address

**Example:**
```
GET /maps/get-route?currentLocation.ltd=40.7128&currentLocation.lng=-74.0060&destination=Los+Angeles,CA
```

**Response:** `200 OK`
```json
{
  "coordinates": [[lng, lat], [lng, lat], ...],
  "distance": 2789.5,
  "duration": 154800
}
```

---

## Ride Endpoints

### Create Ride

Create a new ride request. This will notify nearby captains about the new ride.

**Endpoint:** `POST /rides/create`

**Authentication:** Required (User)

**Request Body:**
```json
{
  "pickup": "123 Main St, New York, NY",
  "destination": "456 Park Ave, New York, NY",
  "vehicleType": "car"
}
```

**Validation Rules:**
- `pickup`: Minimum 3 characters
- `destination`: Minimum 3 characters
- `vehicleType`: Must be one of: `'auto'`, `'car'`, `'moto'`

**Response:** `201 Created`
```json
{
  "ride": {
    "_id": "ride_id",
    "user": "user_id",
    "pickup": "123 Main St, New York, NY",
    "destination": "456 Park Ave, New York, NY",
    "fare": 25.50,
    "status": "pending",
    "duration": 1800,
    "distance": 5000,
    "otp": "123456",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Real-time Event:** Upon creation, all captains within a 2km radius will receive a `new-ride` socket event.

---

### Get Fare Estimate

Get fare estimates for different vehicle types.

**Endpoint:** `GET /rides/get-fare`

**Authentication:** Required (User)

**Query Parameters:**
- `pickup` (string, required): The pickup address
- `destination` (string, required): The destination address

**Example:**
```
GET /rides/get-fare?pickup=New+York,NY&destination=Los+Angeles,CA
```

**Response:** `200 OK`
```json
{
  "auto": 50.0,
  "car": 75.0,
  "moto": 40.0
}
```

---

### Confirm Ride

Confirm a ride request as a captain. This assigns the ride to the captain.

**Endpoint:** `POST /rides/confirm`

**Authentication:** Required (Captain)

**Request Body:**
```json
{
  "rideId": "ride_mongodb_id"
}
```

**Validation Rules:**
- `rideId`: Must be a valid MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "ride": {
    "_id": "ride_id",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      }
    },
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    },
    "pickup": "123 Main St, New York, NY",
    "destination": "456 Park Ave, New York, NY",
    "fare": 25.50,
    "status": "confirmed",
    "otp": "123456"
  }
}
```

**Real-time Event:** The user will receive a `ride-confirmed` socket event.

---

### Start Ride

Start a ride after verifying the OTP. This changes the ride status to "in-progress".

**Endpoint:** `GET /rides/start-ride`

**Authentication:** Required (Captain)

**Query Parameters:**
- `rideId` (MongoDB ObjectId, required): The ride ID
- `otp` (string, required): The OTP (6 characters)

**Example:**
```
GET /rides/start-ride?rideId=ride_id&otp=123456
```

**Validation Rules:**
- `rideId`: Must be a valid MongoDB ObjectId
- `otp`: Must be exactly 6 characters

**Response:** `200 OK`
```json
{
  "ride": {
    "_id": "ride_id",
    "status": "in-progress",
    "startedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Real-time Event:** The user will receive a `ride-started` socket event.

---

### End Ride

End a ride. This marks the ride as completed and calculates the final fare.

**Endpoint:** `POST /rides/end-ride`

**Authentication:** Required (Captain)

**Request Body:**
```json
{
  "rideId": "ride_mongodb_id"
}
```

**Validation Rules:**
- `rideId`: Must be a valid MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "ride": {
    "_id": "ride_id",
    "status": "completed",
    "endedAt": "2024-01-15T10:30:00.000Z",
    "fare": 25.50
  }
}
```

**Real-time Event:** The user will receive a `ride-ended` socket event.

---

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "message": "Invalid email or password"
}
```

### Not Found Error (404 Not Found)
```json
{
  "message": "Coordinates not found"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "message": "Internal server error"
}
```

---

## Real-time Events (Socket.IO)

### Events Emitted by Server

#### `new-ride`
Emitted to captains when a new ride is created in their area.
```json
{
  "event": "new-ride",
  "data": {
    "_id": "ride_id",
    "pickup": "123 Main St",
    "destination": "456 Park Ave",
    "fare": 25.50,
    "vehicleType": "car"
  }
}
```

#### `ride-confirmed`
Emitted to the user when a captain confirms their ride.
```json
{
  "event": "ride-confirmed",
  "data": {
    "_id": "ride_id",
    "captain": { /* captain info */ },
    "status": "confirmed"
  }
}
```

#### `ride-started`
Emitted to the user when the captain starts the ride.
```json
{
  "event": "ride-started",
  "data": {
    "_id": "ride_id",
    "status": "in-progress"
  }
}
```

#### `ride-ended`
Emitted to the user when the ride is completed.
```json
{
  "event": "ride-ended",
  "data": {
    "_id": "ride_id",
    "status": "completed",
    "fare": 25.50
  }
}
```

---

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Real-time:** Socket.IO
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** BCrypt
- **Validation:** Express Validator
- **Maps API:** Mapbox API

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All monetary values are in the base currency unit
- Distance values are in meters
- Duration values are in seconds
- The system automatically assigns nearby captains within a 2km radius of the pickup location
- Ride status flow: `pending` → `confirmed` → `in-progress` → `completed`
- Captains need to start and end sessions to track their working hours
