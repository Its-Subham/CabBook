# CabBook - Ride Booking Platform

A full-stack ride booking application that connects users with captains (drivers) in real-time. Built with React (Vite) for the frontend and Node.js/Express for the backend, featuring real-time tracking with Socket.IO, and integrated mapping services.

## 🚀 Features

### User Features
- **User Registration & Authentication**: Secure user registration and login with JWT authentication
- **Profile Management**: View and manage user profile
- **Ride Booking**: Create ride requests with pickup and destination
- **Fare Estimation**: Get fare estimates for different vehicle types (car, motorcycle, auto)
- **Real-time Tracking**: Track ride status in real-time using WebSocket connections
- **Multiple Vehicle Options**: Choose from car, motorcycle, or auto

### Captain Features
- **Captain Registration**: Register as a captain with vehicle details
- **Captain Authentication**: Secure login for captains
- **Vehicle Information**: Submit and manage vehicle details (color, plate number, capacity, vehicle type)
- **Real-time Ride Updates**: Receive real-time notifications for new ride requests
- **OTP Verification**: Secure ride verification using OTP

### Additional Features
- **Address Autocomplete**: Mapbox autocomplete for address suggestions
- **Distance & Time Calculation**: Calculate distance and estimated travel time
- **Real-time Socket Communication**: Live updates for ride status and tracking
- **Secure Authentication**: JWT-based authentication with token blacklisting
- **Responsive UI**: Modern, responsive design built with React and Tailwind CSS
- **Interactive Maps**: Mapbox-powered interactive maps with real-time tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time WebSocket communication
- **Mapbox GL** - Interactive maps library
- **React Map GL** - React components for Mapbox
- **Mapbox Directions API** - Maps, geocoding, and directions
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library
- **Remix Icon** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **BCrypt** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for external APIs
- **Dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Mapbox access token (for maps, geocoding, and directions)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Its-Subham/CabBook.git
   cd CabBook
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   MAPBOX_API_KEY=your_mapbox_maps_api_key
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_MAPBOX_API_KEY=your_mapbox_maps_api_key
   ```

## 🚀 Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   The backend server will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or the port Vite assigns)

3. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📂 Project Structure

```
CabBook/
├── backend/
│   ├── controllers/      # Business logic controllers
│   ├── models/          # Mongoose data models
│   ├── routes/          # API route definitions
│   ├── middlewares/     # Custom middleware functions
│   ├── services/        # External service integrations
│   ├── db/             # Database configuration
│   ├── app.js          # Express app configuration
│   ├── server.js       # Server startup file
│   ├── socket.js       # Socket.IO configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service functions
│   │   ├── context/    # React context providers
│   │   ├── assets/     # Static assets
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   ├── public/         # Public static files
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### User Endpoints
- `POST /users/register` - Register a new user
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile
- `GET /users/logout` - User logout

### Captain Endpoints
- `POST /captains/register` - Register a new captain
- `POST /captains/login` - Captain login
- `GET /captains/profile` - Get captain profile
- `GET /captains/logout` - Captain logout

### Maps Endpoints
- `GET /maps/get-coordinates` - Get coordinates for an address
- `GET /maps/get-distance-time` - Calculate distance and time
- `GET /maps/get-suggestions` - Get address autocomplete suggestions
- `GET /maps/get-route` - Get route for navigation (captain only)

### Ride Endpoints
- `POST /rides/create` - Create a new ride
- `GET /rides/get-fare` - Get fare estimate
- `POST /rides/confirm` - Captain confirms a ride
- `GET /rides/start-ride` - Start ride with OTP verification
- `POST /rides/end-ride` - End a completed ride

### Captain Statistics & Session Endpoints
- `GET /captains/stats` - Get captain statistics
- `POST /captains/session/start` - Start captain session (go online)
- `POST /captains/session/end` - End captain session (go offline)

For detailed API documentation, see `backend/README.md`

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are sent in:
- **Headers**: `Authorization: Bearer <token>`
- **Cookies**: HTTP-only cookies for added security

## 🌐 Real-time Features

The application uses Socket.IO for real-time communication:
- Live ride status updates
- Real-time captain availability
- OTP verification
- Ride tracking

## 🚗 Vehicle Types

- **Car**: Standard 4-wheeler vehicle
- **Motorcycle**: Two-wheeler vehicle
- **Auto**: Three-wheeler auto-rickshaw

## 📝 Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cabbook
JWT_SECRET=your_super_secret_jwt_key
MAPBOX_API_KEY=your_mapbox_maps_api_key
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_MAPBOX_API_KEY=your_mapbox_maps_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - [Its-Subham](https://github.com/Its-Subham)

## 🙏 Acknowledgments

- Mapbox for maps, geocoding, directions, and autocomplete
- Socket.IO for real-time communication
- React and Node.js communities

## 📧 Contact

For questions or support, please contact: [subhambera80062@gmail.com]

---

Made with ❤️ using React and Node.js
