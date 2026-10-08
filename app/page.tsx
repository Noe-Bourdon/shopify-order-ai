"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import MetricsCards from "@/components/MetricsCards";
import OrderFilters from "@/components/OrderFilters";
import OrderTable from "@/components/OrderTable";
import OrderDetailModal from "@/components/OrderDetailModal";
import GraphQLQueryModal from "@/components/GraphQLQueryModal";
import CredentialsModal from "@/components/CredentialsModal";
import { ShopifyOrder, OrdersApiResponse } from "@/types/shopify";
import { CheckCircle2, AlertCircle, ShoppingBag, User, MapPin, Truck, CreditCard, Package } from "lucide-react";

export default function DashboardPage() {
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMock, setIsMock] = useState<boolean>(true);
  const [isLocalGraphQL, setIsLocalGraphQL] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [financialFilter, setFinancialFilter] = useState("ALL");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("ALL");

  // Custom Live Credentials
  const [storeDomain, setStoreDomain] = useState("");
  const [accessToken, setAccessToken] = useState("");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<ShopifyOrder | null>(null);
  const [isGraphQLModalOpen, setIsGraphQLModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  // Fetch Orders
  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      let url = "/api/shopify/orders?";
      if (storeDomain && accessToken) {
        url += `domain=${encodeURIComponent(storeDomain)}&token=${encodeURIComponent(accessToken)}`;
      }

      const res = await fetch(url);
      const data: OrdersApiResponse = await res.json();

      setOrders(data.orders || []);
      setIsMock(data.isMock);
      setIsLocalGraphQL(data.isLocalGraphQL || false);
      if (data.error) {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setErrorMsg("APIへのリクエストでエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [storeDomain, accessToken]);

  // Filtered Orders logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Financial Filter
      if (financialFilter !== "ALL" && order.displayFinancialStatus !== financialFilter) {
        return false;
      }
      // Fulfillment Filter
      if (fulfillmentFilter !== "ALL" && order.displayFulfillmentStatus !== fulfillmentFilter) {
        return false;
      }
      // Search Term Filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const matchesName = order.name.toLowerCase().includes(term);
        const matchesCustomer = order.customer?.displayName.toLowerCase().includes(term) || false;
        const matchesEmail = order.customer?.email?.toLowerCase().includes(term) || false;
        const matchesPhone = order.customer?.phone?.includes(term) || false;
        const matchesAddress = order.shippingAddress
          ? `${order.shippingAddress.province}${order.shippingAddress.city}${order.shippingAddress.address1}`.toLowerCase().includes(term)
          : false;
        const matchesItem = order.lineItems.some(
          (item) => item.title.toLowerCase().includes(term) || (item.sku && item.sku.toLowerCase().includes(term))
        );

        return matchesName || matchesCustomer || matchesEmail || matchesPhone || matchesAddress || matchesItem;
      }
      return true;
    });
  }, [orders, financialFilter, fulfillmentFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navigation Header */}
      <Navbar
        isMock={isMock}
        isLocalGraphQL={isLocalGraphQL}
        onOpenGraphQLModal={() => setIsGraphQLModalOpen(true)}
        onOpenCredentialsModal={() => setIsCredentialsModalOpen(true)}
      />

      {/* Notification Banner if info or error */}
      {errorMsg && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-300 flex items-center justify-between">
          <div className="mx-auto flex max-w-7xl items-center gap-2 w-full">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-1">
        {/* Top Feature Summary Bar */}
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-950 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Shopify 注文取得 & データ構造ダッシュボード</span>
              </h2>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Shopify Admin GraphQL API を使用して、指定されたすべての要素（注文一覧・注文詳細・商品・顧客・配送先・配送方法・決済/発送状況）を統合表示します。
              </p>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-zinc-300">
              <div className="flex items-center gap-1.5 rounded-lg bg-zinc-950/60 px-2.5 py-1.5 border border-zinc-800">
                <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
                <span>注文一覧 & 詳細</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-zinc-950/60 px-2.5 py-1.5 border border-zinc-800">
                <Package className="h-3.5 w-3.5 text-blue-400" />
                <span>商品 (Line Items)</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-zinc-950/60 px-2.5 py-1.5 border border-zinc-800">
                <User className="h-3.5 w-3.5 text-purple-400" />
                <span>顧客情報</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-zinc-950/60 px-2.5 py-1.5 border border-zinc-800">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>配送先住所</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-zinc-950/60 px-2.5 py-1.5 border border-zinc-800">
                <Truck className="h-3.5 w-3.5 text-amber-400" />
                <span>配送方法</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-zinc-950/60 px-2.5 py-1.5 border border-zinc-800">
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span>支払い/発送状況</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics KPI Cards */}
        <MetricsCards orders={orders} />

        {/* Filters and Search Bar */}
        <OrderFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          financialFilter={financialFilter}
          onFinancialFilterChange={setFinancialFilter}
          fulfillmentFilter={fulfillmentFilter}
          onFulfillmentFilterChange={setFulfillmentFilter}
          onRefresh={fetchOrders}
          isLoading={isLoading}
        />

        {/* Orders Table */}
        <OrderTable
          orders={filteredOrders}
          onSelectOrder={(order) => setSelectedOrder(order)}
          isLoading={isLoading}
        />
      </main>

      {/* Modals */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <GraphQLQueryModal
        isOpen={isGraphQLModalOpen}
        onClose={() => setIsGraphQLModalOpen(false)}
      />

      <CredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        onSaveCredentials={(domain, token) => {
          setStoreDomain(domain);
          setAccessToken(token);
        }}
        currentDomain={storeDomain}
        currentToken={accessToken}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>Shopify Order AI — Powered by Next.js 16 App Router & Shopify GraphQL Admin API</div>
          <button
            onClick={() => setIsGraphQLModalOpen(true)}
            className="text-emerald-400 hover:underline font-mono"
          >
            GraphQL Query Spec
          </button>
        </div>
      </footer>
    </div>
  );
}
