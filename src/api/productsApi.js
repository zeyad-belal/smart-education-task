import { faker } from "@faker-js/faker";

faker.seed(123);

// ---- Fake DB items total ----
const TOTAL = 10_000;
let START = 0;


const pageCache = new Map();      // `${page}:${pageSize}` -> { items, pagination }
const productMap = new Map();     // id -> product (for O(1) get by id)

const key = (page, pageSize) => `${page}:${pageSize}`;

function generatePage(page, pageSize) {
  const items = Array.from({ length: pageSize }, () => {
    const id = faker.string.uuid();
    const p ={
      id,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      thumbnail: `/product.jpg`,
      image: `/product.jpg`,
      description: faker.commerce.productDescription(),
    };
    
    productMap.set(id, p);
    return p
  });

  return {
    items,
    pagination: {
      start: START++,
      end: TOTAL,
      hasNext: Math.ceil(TOTAL / pageSize) > page,
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
  console.log('pageCache',pageCache)
  return data;
}


// O(1) 
export function getProductById(id) {
  if (!id) return null;
  return productMap.get(id) || null;
}