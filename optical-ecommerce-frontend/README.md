# Optical E-commerce Frontend

React application for optical e-commerce platform with React Router v6.

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Navbar.js       # Navigation component
├── pages/              # Page components
│   ├── Home.js         # Home page
│   ├── ProductList.js  # Products listing
│   ├── ProductDetails.js # Product details
│   ├── Cart.js         # Shopping cart
│   ├── Checkout.js     # Checkout process
│   ├── Orders.js       # Order history
│   ├── Login.js        # User login
│   ├── Register.js     # User registration
│   ├── SellerDashboard.js # Seller management
│   ├── AdminDashboard.js  # Admin panel
│   └── index.js        # Page exports
├── context/            # React context providers
├── services/           # API services
├── utils/              # Utility functions
├── App.js              # Main app component with routing
└── index.js            # App entry point
```

## Routes

- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - Order history
- `/login` - User login
- `/register` - User registration
- `/seller` - Seller dashboard
- `/admin` - Admin dashboard

## Getting Started

```bash
npm start
```

## Dependencies

- React 19.2.3
- React Router DOM 7.12.0
- React Scripts 5.0.1