# AI Interview Simulator

An advanced AI-powered mock interview platform designed to help candidates prepare for their dream jobs. The application analyzes your resume, asks tailored questions, and provides instant, detailed feedback on your answers.

## 🚀 Features

- **Resume Parsing:** Upload your PDF resume, and the AI will extract your skills, experience, and projects.
- **Dynamic Question Generation:** Questions are automatically generated based on your resume and target job role.
- **Mixed Interview Format:** Experience a comprehensive interview containing:
  - Multiple Choice Questions (MCQs)
  - Theory / Open-ended Questions
  - Coding Questions
  - Behavioral / HR Questions
- **Real-time AI Evaluation:** Get instant scoring and constructive feedback on every answer you submit.
- **Detailed History:** Review your past interviews, overall scores, strengths, weaknesses, and areas for improvement.
- **Admin Dashboard:** Manage users, view site-wide statistics, and oversee the platform.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Language:** TypeScript

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **AI Integration:** Local LLM Integration via Ollama

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Docker)
- Ollama (For local AI generation)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-interview.git
cd ai-interview
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Docker Setup
You can run the entire application stack (Frontend, Backend, MongoDB, and Ollama) using Docker Compose:
```bash
docker-compose up --build -d
```
This will spin up all necessary containers and link them automatically.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is licensed under the MIT License.
