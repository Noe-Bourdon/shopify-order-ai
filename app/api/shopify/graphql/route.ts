import { NextResponse } from "next/server";
import { MOCK_SHOPIFY_ORDERS } from "@/lib/mockData";

/**
 * Shopify Admin GraphQL API 互換のローカル疑似APIエンドポイント
 * (POST /api/shopify/graphql)
 * 
 * 本物の Shopify Admin GraphQL API (2024-04) と全く同じレスポンス構造(JSON)を返します。
 * これにより、Shopifyのアカウントを作成することなく、
 * リアルな GraphQL 通信・リクエスト送信・レスポンス処理を試すことが可能です。
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { query, variables } = body;

    // ヘッダーのアクセストークン検証（擬似的にチェック）
    const authHeader = request.headers.get("X-Shopify-Access-Token");
    console.log(`[Local Shopify GraphQL API] Request received with query length: ${query?.length || 0}`);

    // MOCK_SHOPIFY_ORDERS から Shopify Admin GraphQL のレスポンスノード形式へ変換
    const edges = MOCK_SHOPIFY_ORDERS.map((order) => {
      return {
        node: {
          id: order.id,
          name: order.name,
          createdAt: order.createdAt,
          processedAt: order.processedAt,
          note: order.note,
          displayFinancialStatus: order.displayFinancialStatus,
          displayFulfillmentStatus: order.displayFulfillmentStatus,
          totalPriceSet: {
            shopMoney: order.totalPrice,
          },
          subtotalPriceSet: {
            shopMoney: order.subtotalPrice,
          },
          totalTaxSet: {
            shopMoney: order.totalTax,
          },
          totalShippingPriceSet: {
            shopMoney: order.totalShippingPrice,
          },
          customer: order.customer
            ? {
                id: order.customer.id,
                displayName: order.customer.displayName,
                firstName: order.customer.firstName,
                lastName: order.customer.lastName,
                email: order.customer.email,
                phone: order.customer.phone,
                ordersCount: order.customer.ordersCount,
              }
            : null,
          shippingAddress: order.shippingAddress
            ? {
                name: order.shippingAddress.name,
                firstName: order.shippingAddress.firstName,
                lastName: order.shippingAddress.lastName,
                company: order.shippingAddress.company,
                address1: order.shippingAddress.address1,
                address2: order.shippingAddress.address2,
                city: order.shippingAddress.city,
                province: order.shippingAddress.province,
                zip: order.shippingAddress.zip,
                country: order.shippingAddress.country,
                phone: order.shippingAddress.phone,
              }
            : null,
          shippingLine: order.shippingLine
            ? {
                title: order.shippingLine.title,
                code: order.shippingLine.code,
                originalPriceSet: {
                  shopMoney: order.shippingLine.price,
                },
              }
            : null,
          lineItems: {
            edges: order.lineItems.map((item) => ({
              node: {
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                sku: item.sku,
                originalUnitPriceSet: {
                  shopMoney: item.unitPrice,
                },
                variant: {
                  title: item.variantTitle,
                  image: item.imageUrl ? { url: item.imageUrl } : null,
                },
              },
            })),
          },
        },
      };
    });

    // Shopify Admin GraphQL 標準のレスポンス形式
    return NextResponse.json(
      {
        data: {
          orders: {
            edges,
          },
        },
        extensions: {
          cost: {
            requestedQueryCost: 10,
            actualQueryCost: 5,
            throttleStatus: {
              maximumAvailable: 1000.0,
              currentlyAvailable: 995.0,
              restoreRate: 50.0,
            },
          },
          isLocalMockApi: true,
          serverTimestamp: new Date().toISOString(),
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-API-Version": "2024-04 (Mock)",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        errors: [
          {
            message: `Shopify Local GraphQL Server Error: ${error.message}`,
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        ],
      },
      { status: 500 }
    );
  }
}

// GET リクエストでこのエンドポイントの情報を返す
export async function GET() {
  return NextResponse.json({
    status: "online",
    message: "Shopify Local GraphQL Mock API Server is running.",
    endpoint: "/api/shopify/graphql",
    method: "POST",
    spec: "Shopify Admin GraphQL API (2024-04)",
  });
}
