# Optical E-commerce Backend

MERN stack backend API for optical e-commerce platform with MVC architecture.

## Features

- User authentication & authorization
- Product management (eyeglasses, sunglasses, contact lenses)
- Order management
- Prescription management
- JWT-based authentication
- Role-based access control (customer/admin)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your MongoDB URI and JWT secret

3. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product (admin only)
- PUT `/api/products/:id` - Update product (admin only)
- DELETE `/api/products/:id` - Delete product (admin only)

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get order by ID
- PUT `/api/orders/:id/status` - Update order status (admin only)

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- POST `/api/users/prescriptions` - Add prescription
- GET `/api/users/prescriptions` - Get user prescriptions

## Project Structure

```
src/
├── controllers/     # Request handlers
├── models/         # Database schemas
├── routes/         # API routes
├── middleware/     # Custom middleware
├── config/         # Configuration files
└── utils/          # Utility functions
```