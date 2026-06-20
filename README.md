# 💬 Real-Time Chat Application with User Roles

A full-stack real-time chat application built with **React.js**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**, featuring role-based access control with **Admin**, **Moderator**, and **User** roles.

---

## 🚀 Live Demo

| Resource | Link |
|---|---|
| 🌐 **Live Application** | [adarsh-realtime-chat-e5wf.vercel.app](https://adarsh-realtime-chat-e5wf.vercel.app) |
| ⚙️ **Backend API** | [chat-app-backend-owjq.onrender.com](https://chat-app-backend-owjq.onrender.com) |
| 📂 **Source Code** | This repository |

### Test Accounts

| Role | Email | Password |
|---|---|---|
| 👤 Register your own User account | — | — |
| ⚙️ Admin (create via instructions below) | admin@test.com | admin123 |

> Note: Since this is a free-tier hosted backend (Render), the server may take **30-60 seconds** to "wake up" on first load if it has been idle.

---

## 📸 Screenshots

### Login Page
![Login Page](screenshots/screenshot-login.png)

### Register Page
![Register Page](screenshots/screenshot-register.png)

### Admin Dashboard & Real-Time Chat
![Admin Dashboard](screenshots/screenshot-admin-dashboard.png)

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login/register with bcrypt password hashing
- ⚡ **Real-Time Messaging** — Instant message delivery using Socket.IO WebSockets
- 👥 **Role-Based Access Control** — Three distinct roles:
  - **Admin** — Delete any message, manage users, ban users, full access
  - **Moderator** — Delete spam messages, monitor rooms, mute users
  - **User** — Send/receive messages, join rooms, view history
- 💬 **Multiple Chat Rooms** — `#general`, `#tech`, `#random`
- 🟢 **Live Online Users Panel**
- ⌨️ **Typing Indicators**
- 💾 **Persistent Chat History** — Stored in MongoDB, survives page refresh
- 🎨 **Modern Dark UI** — Animated gradient background, chat bubbles, role badges

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Real-Time Engine | Socket.IO |
| Database | MongoDB (Atlas) |
| Authentication | JWT, bcrypt.js |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## 📁 Project Structure

```
Mini-Project/
├── backend/
│   ├── models/          # User & Message Mongoose schemas
│   ├── routes/           # Auth REST API routes
│   ├── middleware/       # JWT auth & role-authorization middleware
│   ├── socket/            # Socket.IO real-time event handlers
│   └── server.js          # Express + Socket.IO entry point
├── frontend/
│   └── src/
│       ├── components/   # Login.js, Chat.js
│       └── context/      # AuthContext.js (global auth state)
├── screenshots/           # App screenshots for documentation
├── Mini_Project_PPT.pptx
└── Mini_Project_Report.docx
```

---

## ⚙️ Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed (or a MongoDB Atlas connection string)

### 1. Clone the repository
```bash
git clone https://github.com/AdarshEtipakulu/Mini-Project.git
cd Mini-Project
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=mysecretkey123
```
Start the backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## 🔄 Real-Time Communication Flow

1. User types a message and clicks **Send**
2. Frontend emits a `send_message` event via Socket.IO
3. Backend saves the message to MongoDB
4. Backend broadcasts `receive_message` to all users in that room
5. All connected clients receive the message **instantly** — no refresh needed

---

## 👨‍💻 Author

**Adarsh Etipakulu**
Mini Project — June 2026
