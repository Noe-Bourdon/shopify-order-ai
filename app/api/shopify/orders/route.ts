import { NextResponse } from "next/server";
import { getShopifyOrders, SHOPIFY_ADMIN_ORDERS_GRAPHQL_QUERY } from "@/lib/shopify";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const useMock = searchParams.get("mock") === "true";
  const storeDomain = searchParams.get("domain") || undefined;
  const accessToken = searchParams.get("token") || undefined;

  const result = await getShopifyOrders({
    useMockOnly: useMock,
    storeDomain,
    accessToken,
    origin,
  });

  return NextResponse.json({
    orders: result.orders,
    isMock: result.isMock,
    isLocalGraphQL: result.isLocalGraphQL || false,
    totalCount: result.orders.length,
    graphQLQueryUsed: SHOPIFY_ADMIN_ORDERS_GRAPHQL_QUERY.trim(),
    error: result.error,
  });
}
