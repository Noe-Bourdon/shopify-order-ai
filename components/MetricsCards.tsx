"use client";

import { ShopifyOrder } from "@/types/shopify";
import { DollarSign, ShoppingCart, Clock, CheckCircle2, PackageCheck } from "lucide-react";

interface MetricsCardsProps {
  orders: ShopifyOrder[];
}

export default function MetricsCards({ orders }: MetricsCardsProps) {
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (parseFloat(order.totalPrice.amount) || 0);
  }, 0);

  const unfulfilledCount = orders.filter(
    (o) => o.displayFulfillmentStatus === "UNFULFILLED" || o.displayFulfillmentStatus === "IN_PROGRESS"
  ).length;

  const paidCount = orders.filter((o) => o.displayFinancialStatus === "PAID").length;
  const paidRate = totalOrders > 0 ? Math.round((paidCount / totalOrders) * 100) : 0;

  const currencyCode = orders[0]?.totalPrice?.currencyCode || "JPY";

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">総注文金額</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white">
            {formatPrice(totalRevenue)}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {totalOrders} 件の注文合計
          </p>
        </div>
      </div>

      {/* Total Orders */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">総注文数</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white">
            {totalOrders} <span className="text-sm font-normal text-zinc-400">件</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            最新の同期データ
          </p>
        </div>
      </div>

      {/* Unfulfilled Orders */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">未発送 (発送待ち)</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-amber-400">
            {unfulfilledCount} <span className="text-sm font-normal text-zinc-400">件</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            要出荷対応
          </p>
        </div>
      </div>

      {/* Payment Completion Rate */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">決済完了率</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white">
            {paidRate}%
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {paidCount} / {totalOrders} 件 決済済み
          </p>
        </div>
      </div>
    </div>
  );
}
