# LinkedIn-like Community Platform

A mini LinkedIn-like community platform built with React, Node.js, Express, and MongoDB. This platform allows users to create accounts, share posts, interact with others through likes and comments, and view user profiles.

## Features

### ✅ User Authentication
- **Register/Login**: Email and password authentication
- **Profile Management**: Name, email, and bio with edit functionality
- **JWT Token Authentication**: Secure authentication with token-based sessions

### ✅ Public Post Feed
- **Create Posts**: Text-only posts with character limits
- **Home Feed**: Display all posts with author names and timestamps
- **Real-time Updates**: Posts appear immediately after creation

### ✅ Profile Pages
- **Personal Profile**: View and edit your own profile
- **User Profiles**: View other users' profiles and their posts
- **Post Management**: Delete your own posts

### ✅ Social Features
- **Like/Unlike Posts**: Interactive like functionality
- **Comments**: Add comments to posts
- **User Discovery**: Click on user names to view profiles

## Tech Stack

- **Frontend**: React 18 with React Router
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with bcrypt password hashing
- **Styling**: CSS with LinkedIn-inspired design

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd linkedin-community-platform
```

### 2. Install Dependencies & Build
```bash
npm install && cd backend && npm install && cd ../frontend && npm install && npm run build
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The app will automatically connect to `mongodb://localhost:27017/linkedin-community`

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a cluster and get your connection string
3. Update the `MONGODB_URI` in `backend/config.env`

### 4. Environment Configuration

Update the `backend/config.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/linkedin-community
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

Update the `frontend/.env` file:
```env
REACT_APP_BASE_URL=/api
```

### 5. Start the Application

#### Production/Deployment Start
```bash
npm install && cd backend && npm install && node server.js
```

This will start the backend server (serving the React build in production).

#### Development Mode (Recommended)
```bash
# From the root directory
npm run dev
```
This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get post by ID
- `DELETE /api/posts/:id` - Delete a post
- `PUT /api/posts/:id/like` - Like/unlike a post
- `POST /api/posts/:id/comments` - Add comment to post

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/posts` - Get user's posts
- `PUT /api/users/profile` - Update user profile

## Project Structure

```
Mini-Linkedin/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config.env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── .env
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api.js
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   ├── pages/
│   │   │   └── posts/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```
## Centralized API Calls

All frontend API requests use a centralized Axios instance in `frontend/src/api.js`:
```js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

export default api;
```
Update your imports in components and context to use this instance.
## Deployment on Render

**Build command:**
```
npm install && cd ./frontend && npm install && npm run build
```

**Start command:**
```
npm install && cd backend && npm install && node server.js
```

This ensures all dependencies are installed and the backend serves the built frontend in production.

## Features in Detail

### User Authentication
- Secure registration with email validation
- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes for authenticated users

### Post System
- Create text posts with character limits
- Real-time post creation and display
- Like/unlike functionality
- Comment system with user attribution
- Post deletion for authors

### Profile System
- Editable user profiles with name and bio
- View other users' profiles
- Display user's posts on their profile
- Member since information

### UI/UX Features
- LinkedIn-inspired design with professional color scheme
- Responsive design for mobile and desktop
- Loading states and error handling
- Intuitive navigation and user flow

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Token-based session management
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request handling
- **Error Handling**: Comprehensive error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Happy coding! 🚀** 