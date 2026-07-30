# ⚡ Chatty - Real-Time Full Stack Chat Application 💬

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://chitchat-rv2h.onrender.com)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN_%2B_Socket.io-blue?style=for-the-badge&logo=node.js)](https://chitchat-rv2h.onrender.com)
[![UI](https://img.shields.io/badge/UI-TailwindCSS_%2B_DaisyUI-purple?style=for-the-badge&logo=tailwindcss)](https://chitchat-rv2h.onrender.com)

A modern, high-performance, real-time messaging web application built using the MERN stack (MongoDB, Express, React, Node.js), Socket.io, TailwindCSS, DaisyUI, and Zustand.

🔗 **Live Application URL**: [https://chitchat-rv2h.onrender.com](https://chitchat-rv2h.onrender.com)

---

## 🚀 Instant Demo Sign-In
Test the app instantly without registering by clicking the **"⚡ Instant Demo Sign In"** buttons on the login page or using these credentials:

| Account | Email | Password |
| :--- | :--- | :--- |
| 👩 **Emma Thompson** | `emma.thompson@example.com` | `123456` |
| 👨 **James Anderson** | `james.anderson@example.com` | `123456` |

---

## ✨ Features
- ⚡ **Real-Time Messaging**: Powered by Socket.io for instant message delivery and real-time online status indicators.
- 🔐 **Authentication & Security**: Secure user signup, login, JWT token cookies, and bcrypt password hashing.
- 🖼️ **Cloud Image Sharing**: Send image attachments in chat powered by Cloudinary.
- 🎨 **Theme Customization**: 32 DaisyUI color themes available in settings.
- 🔍 **Contact Search & Filters**: Search contacts by name/email and filter online-only users.
- 📱 **Fully Responsive UI**: Modern glassmorphism layout tailored for both desktop and mobile screens.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, DaisyUI, Lucide Icons, React Router, Zustand, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.io, Cloudinary, Cookie Parser
- **Deployment**: Render (Single-domain monorepo architecture)

---

## ⚙️ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sumit2287/Real-Time-CHat-app.git
   cd Real-Time-CHat-app
   ```

2. **Configure `.env` in the `backend` folder**:
   Create a `backend/.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5001
   JWT_SECRET=your_jwt_secret

   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   NODE_ENV=development
   ```

3. **Install dependencies & build**:
   ```bash
   npm run build
   ```

4. **Seed Database (Optional)**:
   ```bash
   npm run seed
   ```

5. **Run the App**:
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

