# Sari-Sari Store Management System

A full-stack web application for managing the daily operations of a sari-sari store. It provides tools for products, inventory, sales, customer credit, transactions, reports, and dashboard analytics.

## Features

- Secure administrator login
- Product and category management
- Inventory tracking with low-stock monitoring
- Point-of-sale workflow and transaction history
- Customer credit (`utang`) management
- Sales reports and spreadsheet export
- Dashboard summaries and store analytics
- Optional AI store assistant
- Responsive web interface

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js and Express
- MySQL
- JSON Web Tokens (JWT)
- bcrypt password hashing
- ExcelJS

## Project Structure

```text
SariSariStoreProject/
|-- sarisaristore-frontend/   # React client
|-- sarisaristore-backend/    # Express API and database migrations
|-- package.json
`-- README.md
```

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (a current LTS version is recommended)
- npm
- MySQL 8 or a compatible MySQL database

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/russelfordguinoo-oss/SariSariStoreProject.git
cd SariSariStoreProject
```

### 2. Create the database

Create an empty MySQL database. The backend automatically runs the included migrations when it starts.

```sql
CREATE DATABASE sarisari_store;
```

### 3. Configure the backend

Create `sarisaristore-backend/.env`:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sarisari_store
DB_SSL=false

JWT_SECRET=replace_with_a_long_random_secret

ADMIN_NAME=Store Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_secure_password

# Optional AI assistant
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-terra
```

For a hosted database that requires TLS, set `DB_SSL=true` and provide `DB_SSL_CA` as required by the provider.

### 4. Configure the frontend

Create `sarisaristore-frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Install dependencies

Run these commands in separate terminals or one after the other:

```bash
cd sarisaristore-backend
npm install
```

```bash
cd sarisaristore-frontend
npm install
```

### 6. Start the application

Start the backend:

```bash
cd sarisaristore-backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd sarisaristore-frontend
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`. Log in using the administrator email and password configured in the backend `.env` file.

The API health endpoint is available at `http://localhost:5000/api/health`.

## Available Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with automatic restart |
| `npm start` | Start the API normally |
| `npm run create:admin` | Create or update the configured administrator |

## Security Notes

- Never commit `.env` files, database credentials, JWT secrets, or API keys.
- Use strong administrator passwords and a long, random `JWT_SECRET` in production.
- Configure production CORS and database access for trusted origins only.

## Repository

[github.com/russelfordguinoo-oss/SariSariStoreProject](https://github.com/russelfordguinoo-oss/SariSariStoreProject)
