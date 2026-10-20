# 🏡 Airbnb Clone: Full-Stack MERN Application

A full-stack Airbnb-inspired vacation rental platform where users can sign up, browse property listings, create their own listings, and book stays. Built with the MERN stack and deployed on Render.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Stack](https://img.shields.io/badge/stack-MERN-green)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

**🔗 Live Demo:** [https://airbnb-gn0m.onrender.com](https://airbnb-gn0m.onrender.com)

> ⚠️ **Note:** The backend is hosted on Render's free tier. After a period of inactivity, the server spins down and the first request can take **50 seconds or more** to wake up. Please be patient on your first visit.

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Architecture](#-architecture)
5. [Project Structure](#-project-structure)
6. [Getting Started](#-getting-started)
7. [Environment Variables](#-environment-variables)
8. [API Reference](#-api-reference)
9. [Authentication Flow](#-authentication-flow)
10. [Data Models](#-data-models)
11. [Deployment](#-deployment)
12. [Troubleshooting](#-troubleshooting)
13. [Roadmap](#-roadmap)
14. [Contributing](#-contributing)
15. [License](#-license)
16. [Author](#-author)

---

## 📖 Overview

This project recreates the core experience of Airbnb: hosts publish properties, guests discover them and make bookings, and everything is tied together with secure user accounts. It was built to practice designing a production-style full-stack app, covering REST API design, JWT authentication with HTTP-only cookies, database modeling, cross-origin deployment, and a responsive React frontend.

---

## ✨ Features

### Authentication & Accounts
- User registration with name, email, and password
- Secure login and logout
- Passwords hashed with **bcrypt** before being stored
- **JWT-based sessions** stored in **HTTP-only, secure cookies** (not accessible from JavaScript, which protects against XSS token theft)
- Persistent sessions: the app checks the current user on load
- Protected routes via authentication middleware

### Listings
- Create, view, update, and delete property listings
- Listing details such as title, description, price, location, and images
- Browse all available listings on the home page
- View a detailed page for each property

### Bookings
- Book a listing for selected dates
- View your bookings
- Cancel a booking

### User Experience
- Fully responsive UI (mobile, tablet, desktop)
- Clean, Airbnb-inspired design
- Password show/hide toggle on auth forms
- Friendly error messages from the API

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB with Mongoose ODM (hosted on MongoDB Atlas) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs, cookie-parser |
| **HTTP Client** | Axios |
| **Deployment** | Render (frontend and backend) |
| **Version Control** | Git & GitHub |

---

## 🏗 Architecture

```
┌──────────────────┐        HTTPS (cookies)       ┌──────────────────┐
│   React (Vite)   │  ─────────────────────────▶  │  Express API     │
│   Frontend       │  ◀─────────────────────────  │  (Node.js)       │
│   Render Static  │       JSON responses         │  Render Web Svc  │
└──────────────────┘                              └────────┬─────────┘
                                                           │ Mongoose
                                                           ▼
                                                  ┌──────────────────┐
                                                  │  MongoDB Atlas   │
                                                  └──────────────────┘
```

The frontend and backend are deployed as **separate services on different domains**. That means cross-origin requests, CORS with credentials, and `SameSite=None; Secure` cookies are all required for authentication to work in production. See [Deployment](#-deployment) for the exact configuration.

---

## 📂 Project Structure

```
Airbnb/
├── backend/
│   ├── config/
│   │   └── token.js              # JWT generation helper
│   ├── controllers/
│   │   ├── auth.controller.js    # Signup, login, logout
│   │   ├── booking.controller.js # Booking logic
│   │   ├── lisiting.controller.js# Listing CRUD logic
│   │   └── user.controller.js    # Current user / profile logic
│   ├── middleware/               # Auth (JWT verification) and other middleware
│   ├── model/                    # Mongoose schemas (User, Listing, Booking)
│   ├── public/                   # Static / uploaded assets
│   ├── routes/                   # Express route definitions
│   ├── index.js                  # App entry point
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/                      # React components, pages, context, assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- A **MongoDB** database (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/Raghuraj-stack/Airbnb.git
cd Airbnb
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (see [Environment Variables](#-environment-variables)), then start the server:

```bash
npm run dev     # development with auto-reload (if nodemon is configured)
# or
npm start       # production mode
```

The API runs on `http://localhost:8000` by default.

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`, then start the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

### 4. Open the app

Visit **http://localhost:5173**, create an account, and start exploring.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the Express server listens on | `8000` |
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/airbnb` |
| `JWT_SECRET` | Long, random secret used to sign tokens | `a-long-random-string` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `NODE_ENV` | `development` or `production` | `development` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:8000` |

> 🔒 **Never commit `.env` files.** Make sure they are listed in `.gitignore`. Generate a strong `JWT_SECRET` with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## 📡 API Reference

> Base URL (local): `http://localhost:8000`
> Routes marked 🔒 require a valid auth cookie.

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/signup` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive a session cookie | No |
| `POST` | `/api/auth/logout` | Clear the session cookie | No |

**Signup request body**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```

**Possible responses**

| Status | Meaning |
|--------|---------|
| `201` | User created and logged in |
| `400` | Missing fields or user already exists |
| `500` | Server error |

### User

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/user/currentuser` | Get the logged-in user | 🔒 |

### Listings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/listing/get` | Get all listings | No |
| `GET` | `/api/listing/:id` | Get one listing | No |
| `POST` | `/api/listing/add` | Create a listing | 🔒 |
| `PUT` | `/api/listing/update/:id` | Update a listing | 🔒 |
| `DELETE` | `/api/listing/delete/:id` | Delete a listing | 🔒 |

### Bookings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/booking/create/:listingId` | Book a listing | 🔒 |
| `GET` | `/api/booking/my` | Get your bookings | 🔒 |
| `DELETE` | `/api/booking/cancel/:id` | Cancel a booking | 🔒 |

> 📝 Endpoint paths above reflect the intended API design. Check the files in `backend/routes/` for the exact paths in your version.

---

## 🔑 Authentication Flow

1. **Signup / Login:** the client sends credentials to the API.
2. The server validates input, hashes the password with bcrypt (signup) or compares it (login).
3. The server generates a **JWT** containing the user's ID.
4. The JWT is sent back in an **HTTP-only cookie** with these options:

   ```js
   res.cookie("token", token, {
     httpOnly: true,
     secure: true,
     sameSite: "none",              // must be a string, not a bare variable
     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
   });
   ```

5. On every protected request, the browser automatically attaches the cookie. The auth middleware verifies the JWT and attaches the user ID to the request.
6. **Logout** clears the cookie using the *same* options it was set with:

   ```js
   res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
   ```

**Why these cookie settings?**

| Option | Reason |
|--------|--------|
| `httpOnly: true` | JavaScript can't read the cookie, which mitigates XSS token theft |
| `secure: true` | Cookie is only sent over HTTPS |
| `sameSite: "none"` | Required because the frontend and backend live on different domains |

> For local development over plain `http://localhost`, you may use `sameSite: "lax"` and `secure: false` by switching on `NODE_ENV`.

---

## 🗄 Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Required, stored as a bcrypt hash |
| `createdAt` / `updatedAt` | Date | Added automatically |

### Listing

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `description` | String | Property description |
| `price` | Number | Price per night |
| `location` | String | City / address |
| `images` | [String] | Image URLs |
| `host` | ObjectId → User | The listing owner |

### Booking

| Field | Type | Notes |
|-------|------|-------|
| `listing` | ObjectId → Listing | The booked property |
| `guest` | ObjectId → User | The user who booked |
| `checkIn` | Date | Start date |
| `checkOut` | Date | End date |
| `totalPrice` | Number | Calculated total |

> 📝 Schemas are summarized here for documentation. See `backend/model/` for the source of truth.

---

## ☁️ Deployment

Both services are deployed on **[Render](https://render.com)**.

### Backend (Web Service)

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Environment | Add all backend variables from the table above |

**Required production configuration in `index.js`:**

```js
import cors from "cors";
import cookieParser from "cookie-parser";

app.set("trust proxy", 1);        // needed so secure cookies work behind Render's proxy

app.use(cors({
  origin: process.env.CLIENT_URL,  // exact frontend URL, NOT "*"
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
```

### Frontend (Static Site)

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Environment | `VITE_API_URL` = your backend's Render URL |

Add a rewrite rule so client-side routing works on refresh: **Redirects/Rewrites → `/*` → `/index.html` (Rewrite)**.

### MongoDB Atlas

In **Network Access**, allow `0.0.0.0/0`. Render's outbound IPs are not fixed, so a restricted allowlist will cause database calls to hang.

### Frontend API calls

Every request that depends on the cookie must send credentials:

```js
// axios
axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, data, { withCredentials: true });

// fetch
fetch(url, { credentials: "include" });
```

---

## 🧯 Troubleshooting

### Request stays on `(pending)` forever in the Network tab
The server accepted the request but the route handler never sent a response. Check the Render logs for an error thrown inside the handler. Every `catch` block must send a response:

```js
} catch (error) {
  console.log("Sign Up Error", error);
  return res.status(500).json({ message: `Signup error: ${error.message}` });
}
```

### `ReferenceError: none is not defined`
`sameSite` was set to the bare word `none` instead of the string `"none"`. Fix: `sameSite: "none"`.

### Login works but you're logged out after refresh
- Confirm `credentials: true` in CORS with a **specific origin**, not `*`
- Confirm the frontend sends `withCredentials: true` / `credentials: "include"`
- Confirm `app.set("trust proxy", 1)` is set on the backend
- In DevTools → Application → Cookies, check that the `token` cookie exists with `Secure` and `SameSite=None`

### `400` on `/currentuser` when not logged in
This is expected when there is no valid session cookie. Consider returning `401` or an empty `{ user: null }` response instead so the frontend can handle it cleanly.

### First request is very slow
Render's free tier spins services down after inactivity. The first request wakes the server and can take 50 seconds or more.

### "User already exists" when retrying signup
A previous attempt saved the user before failing later in the handler. Use a different email or delete the test user from Atlas (**Browse Collections → users**).

### Database calls hang with no error
Mongoose buffers queries when it isn't connected. Verify `MONGODB_URL` is set on Render, Atlas Network Access allows Render, and your logs show a successful connection at startup.

---

## 🗺 Roadmap

- [ ] Image uploads with Cloudinary
- [ ] Search and filter listings (location, price, dates, guests)
- [ ] Reviews and ratings
- [ ] Wishlist / favorites
- [ ] Availability calendar to prevent double bookings
- [ ] Payment integration (Stripe / Razorpay)
- [ ] Map view with listing locations
- [ ] Email verification and password reset
- [ ] Input validation with Zod or Joi
- [ ] Rate limiting and security headers (`helmet`)
- [ ] Automated tests (Jest / Supertest / React Testing Library)
- [ ] CI/CD with GitHub Actions

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please keep pull requests focused and describe what changed and why.

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## 👤 Author

**Raghuraj Singh Chouhan**

- GitHub: [@Raghuraj-stack](https://github.com/Raghuraj-stack)
- Email: raghurajsinghchouhan9@gmail.com

---

> ⭐ If you found this project helpful, consider giving it a star on GitHub!
>
> *This project is for educational purposes and is not affiliated with Airbnb, Inc.*
