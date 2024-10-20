# Swift Ride: Modern Cab Booking System

## Overview

Swift Ride is a sophisticated cab booking system built with Next.js, React, and MongoDB. It offers a seamless experience for users to book cabs, and for administrators to manage the cab fleet. The system features real-time updates, intelligent routing, a user-friendly interface, and automated email confirmations.

## Key Features

- **User Authentication**: Secure signup and login functionality with role-based access control.
- **Cab Booking**: Intuitive interface for users to book cabs with real-time availability.
- **Dynamic Routing**: Utilizes a graph-based algorithm to calculate the shortest path and estimated time for rides.
- **Admin Dashboard**: Comprehensive tools for administrators to manage cabs and view bookings.
- **Real-time Updates**: Live updates on cab availability and status.
- **Booking History**: Users can view their past bookings and details.
- **Email Notifications**: Automated email notifications for booking confirmations.

## Technology Stack

- **Frontend**: Next.js, React, Ant Design
- **Backend**: Node.js with Next.js API routes
- **Database**: MongoDB
- **State Management**: Redux with Redux Toolkit
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Tailwind CSS
- **Email Service**: Resend

## Project Structure

```
swift-ride/
│
├── pages/
│   ├── api/
│   │   ├── bookings.ts
│   │   ├── cabs.ts
│   │   ├── login.ts
│   │   ├── signup.ts
│   │   ├── verify-token.ts
│   │   └── send-mail.ts
│   ├── _app.tsx
│   ├── book-cab.tsx
│   ├── booking-history.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── manage-cabs.tsx
│   └── signup.tsx
│
├── components/
│   ├── Footer.tsx
│   ├── GraphVisualization.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── Loader.tsx
│   └── withAuth.tsx
│
├── store/
│   ├── authSlice.ts
│   ├── store.ts
│   └── userSlice.ts
│
├── utils/
│   ├── graph.ts
│   └── PriorityQueue.ts
│
├── libs/
│   ├── mongodb.ts
│   └── cabs.ts
│
├── models/
│   └── User.ts
│
├── types/
│   └── index.ts
│
├── styles/
│   └── globals.css
│
├── public/
│
├── .env.local
├── next.config.js
├── package.json
└── README.md
```

## Key Components

1. **Home Page (`index.tsx`)**: Landing page with an overview of the service.
2. **Book Cab Page (`book-cab.tsx`)**: Main interface for users to book cabs.
3. **Manage Cabs Page (`manage-cabs.tsx`)**: Admin interface for cab management.
4. **Login/Signup Pages**: User authentication interfaces.
5. **Booking History Page**: Displays user's past bookings.

## Core Functionalities

### Cab Booking Process
1. User selects source and destination.
2. System calculates the shortest route using a graph algorithm.
3. Available cabs are displayed with pricing.
4. User selects a cab and confirms booking.
5. System updates cab availability and sends confirmation email.

### Email Booking Confirmation
- Automatic email sent to user upon successful booking.
- Email includes:
  - Booking details (source, destination, estimated time)
  - Cab information (name, arrival time)
  - Estimated price
- Implemented using the Resend email service.
- Email sending logic handled in `/api/send-mail.ts`.

### Admin Features
- Add, edit, and delete cabs from the fleet.
- View and manage all bookings.
- Monitor real-time cab statuses.

### Authentication and Authorization
- JWT-based authentication.
- Role-based access control (User, Admin).
- Protected routes using custom `withAuth` HOC.

### State Management
- Centralized state management using Redux.
- Separate slices for user and auth states.

## API Routes

- `/api/bookings`: Manage booking creation and retrieval.
- `/api/cabs`: Handle cab CRUD operations.
- `/api/login` & `/api/signup`: User authentication.
- `/api/verify-token`: JWT verification.
- `/api/send-mail`: Handle sending of confirmation emails.

## Data Models

### User
- Name, Email, Password, Role

### Cab
- Name, Price per minute, Status, Description

### Booking
- User Email, Source, Destination, Estimated Time, Price, Cab Details

## Unique Features

- **Graph-based Routing**: Custom implementation for efficient path finding.
- **Real-time Cab Status Updates**: Automatic status changes based on bookings.
- **Interactive Map Visualization**: Visual representation of the cab network.
- **Automated Email Confirmations**: Instant booking confirmations sent to users.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
   - Include Resend API key for email functionality
4. Run the development server: `npm run dev`

