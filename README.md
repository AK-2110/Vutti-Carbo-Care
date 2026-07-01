# Vutti Carbo Care

A comprehensive web application for managing engine carbon cleaning services. This platform features a modern, responsive design and includes both a customer-facing portal and a full-featured administration dashboard for business management.

## Project Structure

This is a full-stack monorepo application divided into two main parts:

- `/frontend`: A modern React application built with Vite, Tailwind CSS, and Lucide Icons.
- `/backend`: A Node.js API using Express, Drizzle ORM, and SQLite for data persistence.

## Features

### For Customers (User Dashboard)
- **Service History:** Track past carbon cleaning jobs and view their impact on vehicle performance.
- **Carbon Summary:** View personalized metrics like reduced emissions and improved fuel economy.
- **Responsive Design:** Fully accessible on mobile phones, tablets, and desktops.

### For Admins (Admin Dashboard)
- **Job Management:** Track "Today's Jobs" and manage customer service records.
- **Business Insights:** View revenue, completed jobs, and average emission reductions.
- **Customer Database:** Keep track of returning customers and their vehicle details.

---

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### 1. Setting up the Backend
Navigate to the backend directory and start the server:

```bash
cd backend
npm install
npm run dev
```
The backend server will run on `http://localhost:3000` (by default) and will automatically create a local `sqlite.db` database.

### 2. Setting up the Frontend
Open a new terminal window, navigate to the frontend directory, and start the development server:

```bash
cd frontend
npm install
npm run dev
```
The frontend will be accessible at `http://localhost:5173`. 

---

## Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Lucide React (Icons)
- Recharts (Data Visualization)

**Backend:**
- Node.js & Express
- Drizzle ORM
- better-sqlite3 (SQLite Database)

## Author
Created by AK-2110
