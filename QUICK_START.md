# Quick Start Guide 🚀

## Step-by-Step Instructions to Run the Recipe Finder App

### Prerequisites
Make sure you have **Node.js** installed (version 16 or higher).
- Check if Node.js is installed: Open terminal/command prompt and type `node --version`
- If not installed, download from: https://nodejs.org/

---

## Installation Steps

### 1. Install Backend Dependencies

Open a terminal/command prompt and navigate to the backend folder:

```bash
cd backend
npm install
```

Wait for all packages to install (this may take 1-2 minutes).

### 2. Install Frontend Dependencies

Open a **NEW** terminal/command prompt window and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Wait for all packages to install.

### 3. (Optional) Configure OpenAI API Key

If you want AI recommendations to work, create a `.env` file in the `backend` folder:

1. Copy `env.example` to `.env`:
   ```bash
   cd backend
   copy env.example .env
   ```
   (On Mac/Linux: `cp env.example .env`)

2. Open `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
   
   **Note:** If you don't have an OpenAI API key, the app will still work but will use rule-based recommendations instead.

---

## Running the Application

You need to run **TWO** servers simultaneously - one for the backend and one for the frontend.

### Option 1: Using Two Terminal Windows (Recommended)

#### Terminal Window 1 - Backend Server:
```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3001
Connected to SQLite database
Sample recipes inserted
```

#### Terminal Window 2 - Frontend Server:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Option 2: Using PowerShell (Windows)

#### PowerShell Window 1 - Backend:
```powershell
cd backend
npm run dev
```

#### PowerShell Window 2 - Frontend:
```powershell
cd frontend
npm run dev
```

---

## Accessing the Website

Once both servers are running:

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the Recipe Finder app!

---

## Troubleshooting

### Port Already in Use
If you see an error like "Port 3000 is already in use":
- Close any other applications using that port
- Or change the port in `vite.config.js` (frontend) or `.env` (backend)

### Module Not Found Errors
- Make sure you ran `npm install` in both `backend` and `frontend` folders
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

### Database Errors
- The database will be created automatically when you first run the backend
- If you see database errors, delete `recipes.db` file in the backend folder and restart

### CORS Errors
- Make sure the backend is running on port 3001
- Make sure the frontend is running on port 3000
- Check that both servers started successfully

---

## Stopping the Servers

To stop the servers:
- Go to each terminal window
- Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)

---

## What to Expect

When you open the website, you should see:
- A beautiful header with "Recipe Finder" title
- Search bar and filters
- Recipe cards with images
- Click any recipe to see detailed instructions
- Use "AI Recommendations" button for personalized suggestions
- Use "Settings" button to customize preferences

Enjoy cooking! 🍳

