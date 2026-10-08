import { MOCK_SHOPIFY_ORDERS } from "./mockData";
import { ShopifyOrder } from "@/types/shopify";

export const SHOPIFY_ADMIN_ORDERS_GRAPHQL_QUERY = `
query GetShopifyOrders($first: Int = 50) {
  orders(first: $first, sortKey: CREATED_AT, reverse: true) {
    edges {
      node {
        id
        name
        createdAt
        processedAt
        note
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        subtotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalTaxSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalShippingPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
          firstName
          lastName
          email
          phone
          ordersCount
        }
        shippingAddress {
          name
          firstName
          lastName
          company
          address1
          address2
          city
          province
          zip
          country
          phone
        }
        shippingLine {
          title
          code
          originalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              sku
              originalUnitPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              variant {
                title
                image {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export async function getShopifyOrders(options?: {
  useMockOnly?: boolean;
  storeDomain?: string;
  accessToken?: string;
  origin?: string;
}): Promise<{ orders: ShopifyOrder[]; isMock: boolean; isLocalGraphQL?: boolean; error?: string }> {
  const domain = options?.storeDomain || process.env.SHOPIFY_STORE_DOMAIN;
  const token = options?.accessToken || process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  // Determine endpoint URL
  let targetUrl: string;
  let isLocalGraphQL = false;

  if (options?.useMockOnly) {
    return {
      orders: MOCK_SHOPIFY_ORDERS,
      isMock: true,
    };
  }

  if (domain && token) {
    targetUrl = `https://${domain}/admin/api/2024-04/graphql.json`;
  } else {
    // ライブ認証情報がない場合は、アプリ内のローカルGraphQL API (/api/shopify/graphql) を実際に呼び出す
    isLocalGraphQL = true;
    const origin = options?.origin || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    targetUrl = `${origin}/api/shopify/graphql`;
  }

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token || "shpat_local_mock_token_12345",
      },
      body: JSON.stringify({
        query: SHOPIFY_ADMIN_ORDERS_GRAPHQL_QUERY,
        variables: { first: 50 },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Shopify GraphQL API HTTP エラー: ${response.status} ${response.statusText}`);
    }

    const resJson = await response.json();

    if (resJson.errors && resJson.errors.length > 0) {
      throw new Error(`Shopify GraphQL エラー: ${resJson.errors[0].message}`);
    }

    const edges = resJson?.data?.orders?.edges || [];
    const parsedOrders: ShopifyOrder[] = edges.map(({ node }: any) => {
      const lineItems: any[] = (node.lineItems?.edges || []).map(({ node: item }: any) => {
        const qty = item.quantity || 1;
        const unitPriceAmt = parseFloat(item.originalUnitPriceSet?.shopMoney?.amount || "0");
        const totalAmt = (unitPriceAmt * qty).toFixed(2);
        return {
          id: item.id,
          title: item.title,
          quantity: qty,
          sku: item.sku || null,
          variantTitle: item.variant?.title || null,
          imageUrl: item.variant?.image?.url || null,
          unitPrice: item.originalUnitPriceSet?.shopMoney || { amount: "0", currencyCode: "JPY" },
          totalPrice: { amount: totalAmt, currencyCode: item.originalUnitPriceSet?.shopMoney?.currencyCode || "JPY" },
        };
      });

      return {
        id: node.id,
        name: node.name,
        createdAt: node.createdAt,
        processedAt: node.processedAt || node.createdAt,
        note: node.note || null,
        displayFinancialStatus: node.displayFinancialStatus || "PENDING",
        displayFulfillmentStatus: node.displayFulfillmentStatus || "UNFULFILLED",
        totalPrice: node.totalPriceSet?.shopMoney || { amount: "0", currencyCode: "JPY" },
        subtotalPrice: node.subtotalPriceSet?.shopMoney || { amount: "0", currencyCode: "JPY" },
        totalTax: node.totalTaxSet?.shopMoney || { amount: "0", currencyCode: "JPY" },
        totalShippingPrice: node.totalShippingPriceSet?.shopMoney || { amount: "0", currencyCode: "JPY" },
        customer: node.customer ? {
          id: node.customer.id,
          displayName: node.customer.displayName || `${node.customer.lastName || ''} ${node.customer.firstName || ''}`.trim(),
          firstName: node.customer.firstName || "",
          lastName: node.customer.lastName || "",
          email: node.customer.email || null,
          phone: node.customer.phone || null,
          ordersCount: node.customer.ordersCount || 1,
        } : null,
        shippingAddress: node.shippingAddress ? {
          name: node.shippingAddress.name || `${node.shippingAddress.lastName || ''} ${node.shippingAddress.firstName || ''}`.trim(),
          firstName: node.shippingAddress.firstName || "",
          lastName: node.shippingAddress.lastName || "",
          company: node.shippingAddress.company || null,
          address1: node.shippingAddress.address1 || "",
          address2: node.shippingAddress.address2 || null,
          city: node.shippingAddress.city || "",
          province: node.shippingAddress.province || "",
          zip: node.shippingAddress.zip || "",
          country: node.shippingAddress.country || "",
          phone: node.shippingAddress.phone || null,
        } : null,
        shippingLine: node.shippingLine ? {
          title: node.shippingLine.title || "通常配送",
          code: node.shippingLine.code || null,
          price: node.shippingLine.originalPriceSet?.shopMoney || { amount: "0", currencyCode: "JPY" },
        } : null,
        lineItems,
        rawGraphQLNode: node,
      };
    });

    return {
      orders: parsedOrders,
      isMock: false,
      isLocalGraphQL,
    };
  } catch (err: any) {
    console.error("Shopify Order fetch error:", err);
    return {
      orders: MOCK_SHOPIFY_ORDERS,
      isMock: true,
      error: `Shopify API通信エラー: ${err.message || err}。フォールバックとしてデモ用モックデータを表示しています。`,
    };
  }
}
