# Smart Attendance System

This is a full-stack Smart Attendance System for a college Developer's Club, built with the MERN stack, JWT for authentication, and QR code scanning for attendance marking.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation)

## Local Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd attendance-system
```

### 2. Backend Setup
Navigate to the server directory and install dependencies.
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory by copying the example file.
```bash
cp .env.example .env
```
The default values should work for a standard local setup.

### 3. Frontend Setup
Navigate to the client directory and install dependencies.
```bash
cd ../client
npm install
```

### 4. Start the Database
Make sure your local MongoDB server is running. If you installed it as a service, it might already be running. Otherwise, you may need to start it manually.

On Windows, you can often start it with:
```bash
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="c:\data\db"
```
*Make sure the `dbpath` directory exists.*

On macOS/Linux:
```bash
mongod
```

### 5. Run the Application
You'll need two separate terminals for this.

**Terminal 1: Run the Backend**
```bash
cd ../server
npm start
```
You should see the following output:
```
MongoDB connected
Server running on port 5000
```

**Terminal 2: Run the Frontend**
```bash
cd ../client
npm run dev
```
Your browser should automatically open to `http://localhost:5173`.

## How to Verify Everything is Working

1.  **Backend Health Check**: Open your browser or a tool like Postman and navigate to `http://localhost:5000/health`. You should see a JSON response: `{"status":"ok"}`.
2.  **Frontend Home Page**: The application should be running at `http://localhost:5173`. You should see a simple placeholder "Home Page".
3.  **Frontend Routes**:
    - Navigate to `http://localhost:5173/admin` to see the "Admin Page".
    - Navigate to `http://localhost:5173/scan` to see the "Scan QR Page".

If all these steps are successful, the project is set up correctly.
