import { faker } from "@faker-js/faker";

faker.seed(123);

// ---- Fake DB items total ----
const TOTAL = 10_000;
let START = 0;

const pageCache = new Map(); // `${page}:${pageSize}` -> { items, pagination }
const productMap = new Map(); // id -> product (for O(1) get by id)

const key = (page, pageSize) => `${page}:${pageSize}`;

function generatePage(page, pageSize) {
  const items = Array.from({ length: pageSize }, () => {
    const id = faker.string.uuid();
    const p = {
      id,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      thumbnail: `/product.jpg`,
      image: `/product.jpg`,
      description: faker.commerce.productDescription(),
    };

    productMap.set(id, p);
    return p;
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
  console.log("pageCache", pageCache);
  return data;
}

export function generateProductFromId(id) {
  faker.seed(123 + id);
  return {
    id,
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
    thumbnail: "/product.jpg",
    image: "/product.jpg",
    description: faker.commerce.productDescription(),
  };
}

export function getProductById(id) {
  if (!id) return null;

  let product = productMap.get(id); // O(1)

  // incase user refreshed the product details page ( special logic for the fak api generation)
  if (!product) {
    product = generateProductFromId(id);
  }

  return product;
}
