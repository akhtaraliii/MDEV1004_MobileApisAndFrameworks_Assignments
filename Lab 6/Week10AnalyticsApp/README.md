# Analytics Dashboard Application

This application provides a real-time analytics dashboard that tracks page visits and button clicks with user information.

## Features

- User identification system
- Page visit tracking with timestamps
- Button click analytics
- Real-time data updates
- Integration with Google Analytics 4
- MongoDB for data persistence

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repo
2. cd Lab6
3. cd Week10Analytics

4. Install dependencies:
   npm install

5. npm start

6. Open your browser and navigate to:

```
http://localhost:3000
```

## Usage

1. Enter your username in the dashboard
2. View page analytics data
3. Click the test buttons to generate button click analytics
4. Analytics data refreshes automatically every 30 seconds

## API Endpoints

- `GET /analytics` - Get page visit analytics
- `GET /api/button-analytics` - Get button click analytics
- `POST /api/track-button` - Track a new button click

## Implementation Details

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js with Express.js
- Database: MongoDB with Mongoose ODM
- Analytics: Custom tracking + Google Analytics 4 integration

## Contributors

Akhtar Ali
Harshdeep Singh
