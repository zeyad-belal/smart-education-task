// productsApi.js
import { faker } from "@faker-js/faker";

faker.seed(123);

// ---- Fake DB items total ----
const TOTAL = 10_000;
let START = 0;

// ---- Page cache (in-memory) so it gets fetched after a refresh ( CLIENT CACHE ) ----
const pageCache = new Map();
const key = (page, pageSize) => `${page}:${pageSize}`;


function generatePage(page, pageSize) {
  let items = Array.from({ length: pageSize }, () => {
    const id = faker.string.uuid();
    return {
      id,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      thumbnail: `/product.jpg`,
      image: `/product.jpg`,
      description: faker.commerce.productDescription(),
    };
  });
  return {
    items,
    pagination: {
      start: START++,
      end: TOTAL,
      hasNext: pageCache.size * pageSize < TOTAL,
      hasPrev: page > 1,
    },
  };
}

export async function getProductsPage(page, pageSize) {
  if (page < 1) page = 1;
  const k = key(page, pageSize);
  if (pageCache.has(k)) return pageCache.get(k);

  const data = generatePage(page, pageSize);

  pageCache.set(k, data);
  return data;
}

export async function prefetchProductsPage(page, pageSize) {
  const k = key(page, pageSize);
  if (pageCache.has(k)) return Promise.resolve();
  return getProductsPage(page, pageSize).catch(() => {});
}


export function getProductById(id) {
  if (!id) return null;
// O(n) - other solution is to store products in a Map by ID
  for (const pageData of pageCache.values()) {
    const found = pageData.items.find(p => p.id === id);
    if (found) return found;
  }
  return null; 
}
