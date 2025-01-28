# Virtual Office Platform

A real-time virtual office space platform built with Angular and NestJS, featuring WebRTC video communication and real-time avatar interactions.

## Features

- **User Authentication System**
  - Secure login and registration
  - Profile management with avatar customization
  - Password encryption with salt

- **Virtual Spaces**
  - Create and join multiple office spaces
  - Real-time avatar movement
  - Dynamic space capacity management
  - Unique space keys for access control

- **Real-time Communication**
  - WebRTC-powered video and audio calls
  - Avatar-attached video feeds (similar to Kumospace)
  - Real-time chat functionality
  - WebSocket-based position synchronization

- **Technologies Used**
  - Frontend: Angular
  - Backend: NestJS
  - Database: MySQL
  - Real-time Communication: WebSocket, WebRTC
  - Authentication: JWT

## Prerequisites

- Node.js and npm
- MySQL database
- Angular CLI
- NestJS CLI

## Project Structure

```
project-root/
├── api/                 # NestJS backend
│   ├── src/
│   ├── package.json
│   └── ...
└── frontend/           # Angular frontend
    ├── src/
    ├── package.json
    └── ...
```

## Installation

### API (Backend)

```bash
# Navigate to api directory
cd api

# Install dependencies
npm install

# Start the development server
nest start --watch
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
ng serve
```

The application will be available at `http://localhost:4200`

## Database Setup

The project uses MySQL as the primary database. Ensure you have MySQL installed and running on your system.

### Database Schema

The main entities include:
- Users (with authentication details)
- Spaces (virtual rooms)

![Screenshot 2025-01-23 165315](https://github.com/user-attachments/assets/4ec1c3a6-e25c-436d-a557-30d6c1be62e4)


## Acknowledgments

Kumospace for inspiration on the video-avatar interaction concept
