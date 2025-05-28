# Zsar Zsar - Minimalist E-Commerce

A minimalist e-commerce website inspired by Yeezy's design aesthetic, built with Next.js 15 and shadcn/ui.

## Features

- **Minimalist Design**: Clean, modern interface inspired by Yeezy's aesthetic
- **Product Catalog**: Browse footwear and apparel with filtering capabilities
- **Product Details**: View detailed product information with size selection
- **Shopping Cart**: Add items to cart with quantity management
- **Mobile Responsive**: Optimized for all device sizes
- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-commerce
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Navigation header
│   ├── ProductCard.tsx   # Product card component
│   └── ProductDetail.tsx # Product detail modal
├── contexts/             # React contexts
│   └── CartContext.tsx   # Shopping cart state
├── data/                 # Static data
│   └── products.ts       # Product catalog
└── types/                # TypeScript types
    └── product.ts        # Product interfaces
```

## Features Overview

### Product Catalog
- Grid layout with responsive design
- Category filtering (All, Footwear, Apparel)
- Hover effects and smooth transitions

### Product Details
- Modal-based product view
- Size selection interface
- Add to cart functionality
- Mobile-optimized layout

### Shopping Cart
- Slide-out cart panel
- Quantity management
- Item removal
- Real-time total calculation
- Persistent cart state

### Mobile Experience
- Touch-friendly interface
- Responsive navigation
- Optimized modal layouts
- Smooth animations

## Customization

### Adding Products
Edit `src/data/products.ts` to add new products:

```typescript
{
  id: 'unique-id',
  name: 'PRODUCT NAME',
  price: 100,
  image: '/api/placeholder/400/400',
  description: 'Product description',
  sizes: ['S', 'M', 'L'],
  category: 'footwear' | 'apparel'
}
```

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind classes in components for design changes
- Customize shadcn/ui theme in `components.json`

## Deployment

The app can be deployed to any platform that supports Next.js:

### Vercel (Recommended)
```bash
npm run build
```

### Other Platforms
Build the application:
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes. Please respect the design inspiration and use responsibly.
