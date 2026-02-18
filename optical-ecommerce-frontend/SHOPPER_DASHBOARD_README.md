# Shopper Admin Dashboard

A modern, animated admin dashboard for the Optical E-commerce application built with React, Tailwind CSS, and Framer Motion.

## Features

### 🎨 Design
- Clean, professional UI inspired by Amazon Seller Central
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Soft shadows, rounded cards, and clean spacing
- Dark/light mode ready structure

### 📊 Dashboard Components

#### 1. Header
- Hamburger menu for mobile navigation
- Notification bell with indicator
- Shopper profile avatar with name

#### 2. Sidebar Navigation
- Dashboard
- Products
- Orders
- Inventory
- Analytics
- Smooth hover and active state animations
- Responsive drawer on mobile

#### 3. Stat Cards (Animated)
- **Total Revenue**: ₹425 with +12% growth indicator
- **Total Orders**: 3 with +8% growth indicator
- **Total Products**: 3 with "2 active" status
- **Pending Orders**: 1 with "Needs attention" alert
- Features:
  - Count-up animation on load
  - Scale and fade-in effects
  - Hover elevation effect

#### 4. Revenue Overview
- Line chart showing monthly revenue trend
- Smooth transitions and hover tooltips
- Responsive chart sizing

#### 5. Sales by Category
- Donut chart displaying:
  - Frames (45%)
  - Lenses (30%)
  - Sunglasses (25%)
- Animated chart loading

#### 6. Recent Orders Table
- Columns: Order ID, Customer, Date, Total, Status
- Status badges with colors:
  - Processing (Yellow)
  - Shipped (Blue)
  - Delivered (Green)
- Row hover effects
- Staggered animation on load

### ✨ Animations
- Framer Motion powered animations
- Skeleton loaders during data fetch
- Smooth page transitions
- Interactive hover states
- Count-up number animations

## Installation

The required dependencies are already installed:
```bash
npm install framer-motion lucide-react
```

## Usage

Access the dashboard at:
```
http://localhost:3000/shopper
```

## Tech Stack

- **React 19.2.3**: UI framework
- **Tailwind CSS 4.1.18**: Styling
- **Framer Motion**: Animations
- **Chart.js & react-chartjs-2**: Data visualization
- **Lucide React**: Modern icons

## Customization

### Colors
Modify the color scheme in the component:
- Primary: `blue-500`
- Success: `green-500`
- Warning: `orange-500`
- Danger: `red-500`

### Data
Update the mock data in the component:
- `stats`: Stat card values
- `revenueData`: Revenue chart data
- `categoryData`: Category distribution
- `orders`: Recent orders list

### Animations
Adjust animation timing in Framer Motion props:
- `initial`: Starting state
- `animate`: End state
- `transition`: Animation configuration

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements

## Future Enhancements

- Real-time data integration
- Dark mode toggle
- Export functionality
- Advanced filtering
- Date range selector
- More chart types
