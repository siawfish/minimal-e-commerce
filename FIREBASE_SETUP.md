# Firebase Setup for E-commerce Client

This guide explains how to set up Firebase for the e-commerce client application.

## Prerequisites

1. A Firebase project (you can use the same one as the dashboard)
2. Firestore database enabled
3. Firebase configuration credentials

## Environment Variables

Create a `.env.local` file in the client directory with the following variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Getting Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app or create one if it doesn't exist
6. Copy the configuration values to your `.env.local` file

## Firestore Database Structure

The application expects a `products` collection in Firestore with documents that have the following structure:

```typescript
{
  id: string;           // Document ID
  name: string;         // Product name
  price: number;        // Price in the local currency
  images: string[];     // Array of image URLs
  description: string;  // Product description
  sizes: string[];      // Available sizes
  category: string;     // Product category ('footwear' or 'apparel')
}
```

## Firebase Security Rules

Make sure your Firestore security rules allow read access to the products collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products
    match /products/{document} {
      allow read: if true;
    }
  }
}
```

## Features Implemented

- ✅ Product listing from Firestore
- ✅ Individual product detail pages
- ✅ Trending products display
- ✅ Product filtering by category
- ✅ Search functionality
- ✅ Loading states and error handling
- ✅ Responsive design

## Available Hooks

The application provides several custom hooks for data fetching:

- `useProducts()` - Fetch all products
- `useTrendingProducts(limit)` - Fetch trending products
- `useProduct(id)` - Fetch a single product
- `useProductsByCategory(category)` - Fetch products by category
- `useProductSearch(searchTerm)` - Search products

## Usage Example

```typescript
import { useProducts } from '@/hooks/useProducts';

function ProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Development

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`
3. Start the development server: `npm run dev`

The application will automatically connect to your Firebase project and fetch products from Firestore. 