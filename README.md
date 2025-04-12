# Calendar Application

A Google Calendar-like application built with React, Redux, and MongoDB Atlas.

## Features

- Interactive calendar interface with day, week, and month views
- Create, edit, and delete events
- Drag and drop events to reschedule
- Resize events to change duration
- Color-coded event categories (exercise, eating, work, relax, family, social)
- 15-minute time resolution for precise scheduling
- Goals and tasks sidebar with color coordination
- Drag and drop tasks to create events with proper time selection
- Event colors match the goal/task colors
- Persistent data storage in MongoDB Atlas
- Complete RESTful API with CRUD operations

## Technologies Used

- **Frontend**:
  - React 17+
  - Redux Toolkit for state management
  - React Big Calendar with Drag and Drop
  - React DnD for drag and drop functionality
  - React DatePicker for time selection
  - Moment.js for date/time manipulation

- **Backend**:
  - Node.js
  - Express.js
  - Mongoose ODM
  - MongoDB Atlas cloud database
  - RESTful API architecture

- **Development**:
  - Environment variables for configuration
  - Nodemon for backend hot reloading

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient)
3. Set up database access with a username and password
4. Set up network access (Allow access from anywhere for development)
5. Get your connection string from the Connect button on your cluster
6. Replace the placeholder MongoDB URI in .env files with your actual connection string

### Installation

1. Clone the repository

```
git clone https://github.com/your-username/calendar-app.git
cd calendar-app
```

2. Install frontend dependencies

```
npm install
```

3. Install backend dependencies

```
cd backend
npm install
cd ..
```

4. Set up environment variables

Create or update `.env` file in the root directory with:

```
PORT=3000
API_PORT=5000
REACT_APP_API_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster_url>/<your_database>?retryWrites=true&w=majority
NODE_ENV=development
```

Also create a similar `.env` file in the `backend` directory.

5. Seed the database with initial data

```
cd backend
npm run seed
```

6. Start the backend server

```
npm run dev
```

7. In a new terminal, start the frontend application

```
cd calendar-app
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

### Calendar View

- Choose between Day, Week, and Month views
- Click on a time slot to create a new event
- Click on an event to edit or delete it
- Drag events to move them to different times/days
- Resize events to change their duration
- Events can be as short as 15 minutes

### Sidebar

- Shows color-coded goals and their associated tasks
- Click on a goal to see its tasks
- Drag tasks from the sidebar to the calendar to create events
- When you drop a task, it creates an event at that time with the task name
- The color of the created event matches the goal's color

### Event Management

- Set title, category, start time, and end time
- Specify precise durations down to 15-minute intervals
- Color-coding helps identify event categories visually
- Delete events you no longer need

## API Endpoints

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get a specific event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Goals

- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a new goal
- `GET /api/goals/:id` - Get a specific goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?goalId=:goalId` - Get tasks for a specific goal
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```
calendar-app/
├── backend/               # Backend code
│   ├── controllers/       # API controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── .env               # Backend environment variables
│   ├── server.js          # Express server
│   └── seedDatabase.js    # Database seeding script
├── public/                # Static files
├── src/
│   ├── components/        # React components
│   ├── redux/             # Redux state management
│   │   ├── slices/        # Redux Toolkit slices
│   │   └── store.js       # Redux store configuration
│   ├── services/          # API services
│   ├── styles/            # CSS styles
│   ├── utils/             # Utility functions and constants
│   └── App.js             # Main App component
├── .env                   # Frontend environment variables
└── package.json           # Dependencies and scripts
```

- `DELETE /api/tasks/:id` - Delete a task
