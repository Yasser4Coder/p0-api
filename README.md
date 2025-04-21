# Hackathon P0

## Project ID: HACK-2025-YM-001

### Overview

Hackathon P0 is a full-stack application designed for managing a coding competition with 20 teams of 4 members each (80 participants). It provides features for user registration, team formation, competition setup, challenge creation, submission tracking, and score management.

### Features

- **User Management**: Register participants, judges, and admins with roles.
- **Team Management**: Create teams with leaders and members.
- **Competitions**: Define events with start/end dates and associated teams/challenges.
- **Challenges**: Assign tasks with points and track submissions.
- **Submissions**: Upload files (e.g., via Google Drive URLs) and review status.
- **Scoring**: Judges assign scores and comments to submissions.

### Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Middleware**: CORS, Morgan
- **Password Hashing**: bcrypt
- **Development**: Nodemon

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yassinemili/P0.git
   cd P0
   ```
2. Install Dependencies:
   ```bash
   npm install
   ```
3. Set Up Environment Variables:
   Create a .env file in the root directory.
   Add the following (replace with your actual values):

   ```bash
   MONGO_URI=mongodb://localhost:27017/hackathon_p0
   PORT=6000
   JWT_SECRET=ExampleTokenHere

   CLOUDINARY_NAME=examle
   CLOUDINARY_API_KEY=example
   CLOUDINARY_API_SECRET=example
   ```

Run the App:
npm run dev
The server will start on http://localhost:6000 (or your specified PORT).
