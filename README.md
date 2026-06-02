# 🍳 RecipeBook (MERN Stack SPA)

A premium, decoupled, modern recipe cataloging and cooking companion single page application (SPA) built using the **MERN** stack (**MongoDB**, **Express**, **React**, **Node.js**) and styled with **Tailwind CSS v4**.

---

## ✨ Features

* 🌟 **Gorgeous Glassmorphic Dark Mode UI**: Harmonious charcoal and saffron colors, styled with modern typography, text gradients, custom scrollbars, and fluid micro-animations.
* 🛡️ **Robust Authentication & Session Persistence**: Secure password hashing (`bcryptjs`), secure HTTP-only cookie-based JWT sessions, and route guarding (`GlobalAuthGuard`) that checks and verifies sessions on reload or refresh.
* 🍕 **Dynamic Recipe Preview**: A beautiful, unauthenticated landing/entry page at `/` displaying website information and live preview recipe samples fetched from the database.
* 📝 **Interactive Recipe Form**: Create and edit recipes dynamically. Image uploading via Multer, easy time-difficulty options, and interactive lists for ingredients (visual tags) and instructions.
* 👨‍🍳 **Step-by-Step Cooking Player**: Minimize screen clutter during cooking with a large-font, distraction-free player that goes step-by-step through instructions.
* 💬 **Review & Comments System**: Check off ingredients as you prep, read comments, and leave star-ratings or kitchen adjustment notes (authenticated users only).
* 📧 **Feedback Portal**: Direct contact portal allowing users to send feedback with support emails delivered via SMTP (`nodemailer`).

---

## 🏗️ Project Architecture

```
RecipeBook/
├── backend/                  # Node.js + Express API Server
│   ├── config/db.js          # MongoDB Mongoose Connection
│   ├── controllers/          # API Controller Logic (Auth, Recipes, Comments, Feedback)
│   ├── middleware/           # Auth guarding, Multer file upload, Global Error Handler
│   ├── models/               # Mongoose Schemas (User, Recipe, Comment)
│   ├── routes/               # API Router Handlers
│   ├── utils/                # Helper utilities (Async wrappers, error models)
│   ├── .env                  # Server Credentials & Port Config
│   └── server.js             # API entrypoint
│
├── frontend/                 # Vite + React Client
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, RecipeCard, RatingStars)
│   │   ├── context/          # Auth Context for cookie verification & authentication
│   │   ├── pages/            # View dashboards (Home, RecipeDetail, RecipeForm, Profile, Auth)
│   │   ├── services/api.js   # Centralized Fetch wrapper for API calls
│   │   ├── index.css         # Tailwind v4 theme configurations
│   │   └── main.jsx          # React entrypoint
│   └── vite.config.js        # Vite configurations
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port `27017`) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud URI.

---

### ⚙️ Installation & Setup

#### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd RecipeBook
```

#### 2. Configure Backend Environment
Navigate to the `/backend` folder and create a `.env` file containing:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/recipebook
JWT_SECRET=your_super_secret_jwt_signature_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
*Note: Make sure your local MongoDB instance is active on your machine.*

#### 3. Install & Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend API server will start running on [http://localhost:5000](http://localhost:5000).*

#### 4. Install & Start Frontend Client
Open another terminal, navigate to `/frontend`, install packages, and launch Vite dev mode:
```bash
cd frontend
npm install
npm run dev
```
*The client app will launch on [http://localhost:5173](http://localhost:5173).*

---

## 🧪 Verification & Build

To compile a production build of the React client:
```bash
cd frontend
npm run build
```
Vite will compile the assets into a highly compressed production build inside `frontend/dist/`.

---

## 👨‍💻 Author & Contributions
Designed & rebuilt with modern decoupled coding standards. Feel free to clone, edit, or submit PRs to enhance the community features!
