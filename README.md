# 🚀 Live Polling System

A real-time web application designed for dynamic classroom interaction.This system enables **teachers to create live polls** and **students to respond instantly**, enhancing engagement with live results and real-time chat.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7.2-black)
![Status](https://img.shields.io/badge/Deployed-Yes-brightgreen)

---

## 🌐 Live URLs

- **Frontend**: [https://live-polling-system-4klc.vercel.app/](https://live-polling-system-4klc.vercel.app/)
- **Backend API**: [https://live-polling-system-q25z.onrender.com](https://live-polling-system-q25z.onrender.com)

> Use two tabs or devices: one as Teacher, one as Student to test live interaction.

---

## 📌 Assignment Details

- **Title**: Live Polling System
- **Design**: [Figma Design Reference](https://www.figma.com/design/uhinheFgWssbxvlI7wtf59/Intervue-Assigment--Poll-system?node-id=0-1&t=Y5)

---

## ✨ Features

### 👩‍🏫 Teacher Dashboard

- Create live polls with question text and multiple options
- Set custom poll duration (30–120 seconds)
- View real-time poll results with percentage bars
- See connected students with ability to remove any
- Access poll history for previously asked questions
- Live chat popup to communicate with students

### 👨‍🎓 Student Interface

- Join session with a unique name
- Respond to active polls in real time
- See live poll results immediately after submission
- Chat popup for informal classroom discussions

### 💬 Live Chat (Bonus)

- Realtime group chat between students and teacher
- Popup UI with emoji support
- Badges for new messages
- Teacher moderation options (e.g., clear chat)

### 🌗 Theme Support

- Light/Dark mode toggle
- Theme persists across page reloads
- Fully matches Figma color palette & design specs

---

## 🛠️ Technology Stack

| Layer        | Stack                                                                 |
|--------------|-----------------------------------------------------------------------|
| **Frontend** | React 18, Redux Toolkit, Socket.io-client, CSS Modules, CSS Variables |
| **Backend**  | Node.js 16+, Express.js, Socket.io, CORS, UUID                        |
| **Deployment**| Vercel (Frontend), Render (Backend)                                  |
| **Tools**    | Figma (Design), ESLint, Prettier                                      |

---

## 🏗️ Folder Structure

live-polling-system/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── store/
│ │ ├── services/
│ │ └── contexts/
│ ├── public/
│ └── .env
│
├── server/ # Express backend
│ ├── server.js
│ └── .env
└── README.md

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/live-polling-system.git
cd live-polling-system
```

### 2. Setup Backend
```bash

cd server
npm install
npm run dev  # or npm start for production

# Create .env with:
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
```

### 3. Setup Frontend
```bash

cd ../client
npm install
npm start

# Create .env with:
REACT_APP_SERVER_URL=http://localhost:5000
Open http://localhost:3000 and test with two tabs (teacher + student).
```

## 🎨 UI/UX Highlights
- 📐 Figma-perfect layout with accurate spacing, fonts, and buttons

- 🔄 Smooth animated transitions and result graphs

- 💬 Clean, accessible, responsive UI across all screen sizes

- 🎨 Light/Dark themes following Intervue color palette

## 📄 .env Configuration
Frontend .env

``` env

REACT_APP_SERVER_URL=https://your-backend-url
```
Backend .env
```env

PORT=5000
CLIENT_ORIGIN=https://your-frontend-url
```

## ✅ Testing Instructions
- Open Tab 1 as Teacher, create a poll
- Open Tab 2 as Student, answer the poll
-Observe real-time updates, result bars, and chat
-Use timer expiry (60s) to auto-show results

## 📦 Deployment
### Frontend
- Hosted on Vercel
- Auto-deploy on push to main branch

### Backend
- Hosted on Render
- CORS configured for frontend URL

## 💡 Bonus Functionalities

- Student removal by Teacher
- Chat with moderation
- Persistent poll history (session only)
- Responsive & mobile-friendly design
