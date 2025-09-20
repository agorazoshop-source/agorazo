/**
 * Script to update order product snapshots when products are modified
 * This maintains data integrity by keeping order data current while preserving original prices
 */

import { backendClient } from "@/sanity/lib/backendClient";

const client = backendClient;

interface OrderItem {
  _key: string;
  productSnapshot: {
    name: string;
    slug: { current: string };
    description: string;
    images: Array<{
      asset?: {
        _ref: string;
        _type: "reference";
      };
      hotspot?: {
        x: number;
        y: number;
        height: number;
        width: number;
      };
    }>;
    price: number; // Keep original price
    discount: number;
    productLink: string;
    status: string;
  };
}

/**
 * Updates order snapshots for a specific product
 * Preserves original price but updates all other fields
 */
export async function updateOrderSnapshotsForProduct(productId: string) {
  console.log(`Updating order snapshots for product: ${productId}`);

  try {
    // Get the updated product data
    const product = await client.fetch(`
      *[_id == "${productId}"][0] {
        _id,
        name,
        slug,
        description,
        images,
        discount,
        productLink,
        status
      }
    `);

    if (!product) {
      console.log(`Product ${productId} not found`);
      return;
    }

    // Find all orders that reference this product
    const orders = await client.fetch(`
      *[_type == "order" && references("${productId}")] {
        _id,
        items[product._ref == "${productId}"] {
          _key,
          productSnapshot
        }
      }
    `);

    console.log(`Found ${orders.length} orders with this product`);

    let updatedCount = 0;

    for (const order of orders) {
      try {
        // Update each order item that references this product
        const updatedItems = order.items.map((item: OrderItem) => ({
          ...item,
          productSnapshot: {
            ...item.productSnapshot,
            // Update all fields except price
            name: product.name,
            slug: product.slug,
            description: product.description,
            images: product.images,
            discount: product.discount,
            productLink: product.productLink,
            status: product.status,
            // Keep original price
            price: item.productSnapshot.price,
          },
        }));

        // Update the order
        await client.patch(order._id).set({ items: updatedItems }).commit();

        updatedCount++;
        console.log(`✅ Updated order ${order._id}`);
      } catch (error) {
        console.error(`❌ Failed to update order ${order._id}:`, error);
      }
    }

    console.log(`\n✅ Updated ${updatedCount} orders for product ${productId}`);
  } catch (error) {
    console.error("Failed to update order snapshots:", error);
    throw error;
  }
}

/**
 * Updates all order snapshots for all products
 * Useful for bulk updates or initial setup
 */
export async function updateAllOrderSnapshots() {
  console.log("Starting bulk update of all order snapshots...");

  try {
    // Get all products
    const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        name
      }
    `);

    console.log(`Found ${products.length} products to update`);

    let totalUpdated = 0;

    for (const product of products) {
      try {
        await updateOrderSnapshotsForProduct(product._id);
        totalUpdated++;
      } catch (error) {
        console.error(
          `Failed to update snapshots for product ${product._id}:`,
          error
        );
      }
    }

    console.log(`\n✅ Bulk update completed! Updated ${totalUpdated} products`);
  } catch (error) {
    console.error("Bulk update failed:", error);
    throw error;
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const productId = args[0];

  if (productId) {
    // Update specific product
    await updateOrderSnapshotsForProduct(productId);
  } else {
    // Update all products
    await updateAllOrderSnapshots();
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}
