# 🛒 Shopping Cart App (React + SWR + Ant Design)

A performant, modular shopping cart application built with **React 18**, **SWR** for data fetching/caching, and **Ant Design** for UI components.  
Designed to efficiently handle **10,000+ products** with pagination, client-side caching, and an optimized architecture.

---
## 📚 Tech Stack
	•	React 18
	•	SWR
	•	React Router DOM
	•	Ant Design
	•	@faker-js/faker
	•	Vite

### 🚀 Features

### Product Listing
- Displays 10,000+ fake products generated via `@faker-js/faker`
- Grid/List view toggle
- **Pagination with URL sync** → preserves page number on navigation/back
- Prefetches next page for instant navigation
- Client-side search within the current page

### Product Details
- Detailed view with image, description, and price
- Add to cart functionality
- Uses SWR to cache and revalidate product data

### Shopping Cart
- Add/remove items
- Quantity × Price calculation
- Maintains state via React Context (no Redux)

---

## 🛠 Technical Highlights
- **React 18** with functional components & hooks
- **SWR** for declarative data fetching, caching, and revalidation
- **URL state sync** for page number using React Router
- **Ant Design** for responsive UI components
- **Custom hooks** (`useProducts`, `useProduct`) for encapsulated data logic
- **In-memory client cache** for generated product pages
- Modular file structure with clear separation of:
  - `api/` → data layer
  - `hooks/` → reusable hooks
  - `components/` → UI building blocks
  - `pages/` → route-level screens
  - `context/` → global state
  - `layout/` → app shell

---

## 📂 Project Structure

src/
api/              # Fake API functions (productsApi.js)
components/       # UI components (Card, ListView, etc.)
context/          # Cart context & provider
hooks/            # useProducts, useProduct hooks
layout/           # RootLayout wrapper
pages/            # Product list, details, cart
App.jsx           # Router & layout
main.jsx          # App entry point


---

## 🔍 Performance Considerations
- Generates only **the requested page** of products — no full 10k array upfront
- SWR caching avoids duplicate requests
- Prefetches next page in background
- Keeps page state in URL for back/forward navigation without refetching
- Uses `keepPreviousData` in SWR for smooth pagination transitions

---

## 📦 Getting Started
```bash
# Install dependencies
npm install

# Run in dev mode
npm run dev

# Build for production
npm run build



💡 Design Decisions

Why SWR instead of Redux or manual fetching?

SWR provides:
	•	Built-in caching and revalidation
	•	Automatic deduplication of requests
	•	Declarative, hook-based API for cleaner code
	•	Easy prefetching for smooth UX

Why in-memory page caching?
	•	Prevents regenerating fake products unnecessarily
	•	Keeps memory usage lower than preloading all products
	•	Matches real-world API behavior where only requested pages are fetched

Why URL state sync for pagination?
	•	Users can refresh or share URLs without losing page state
	•	Improves navigation consistency when going back/forward

Why not generate all 10k products upfront?
	•	Avoids large memory footprint
	•	Simulates real-world paginated APIs more accurately
	•	Reduces initial load time for better performance

Why modular structure?
	•	Clear separation of concerns
	•	Easy to maintain and extend (add new pages, change UI library, swap data source)
	•	Scales well for larger applications