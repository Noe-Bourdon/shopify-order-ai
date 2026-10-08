"use client";

import { ShopifyOrder, DisplayFinancialStatus, DisplayFulfillmentStatus } from "@/types/shopify";
import { User, Truck, Package, ChevronRight, AlertCircle, CheckCircle2, Clock, RotateCcw } from "lucide-react";

interface OrderTableProps {
  orders: ShopifyOrder[];
  onSelectOrder: (order: ShopifyOrder) => void;
  isLoading: boolean;
}

export default function OrderTable({ orders, onSelectOrder, isLoading }: OrderTableProps) {
  const formatPrice = (amount: string, currency: string) => {
    const val = parseFloat(amount) || 0;
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: currency || "JPY",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const renderFinancialBadge = (status: DisplayFinancialStatus) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            決済完了
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            決済待ち
          </span>
        );
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-400 border border-purple-500/20">
            <RotateCcw className="h-3 w-3" />
            返金済み
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-500/20">
            {status}
          </span>
        );
    }
  };

  const renderFulfillmentBadge = (status: DisplayFulfillmentStatus) => {
    switch (status) {
      case "FULFILLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
            <Package className="h-3 w-3" />
            発送完了
          </span>
        );
      case "UNFULFILLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400 border border-orange-500/20">
            <AlertCircle className="h-3 w-3" />
            未発送
          </span>
        );
      case "PARTIALLY_FULFILLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-400 border border-sky-500/20">
            一部発送
          </span>
        );
      case "RESTOCKED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-500/20">
            在庫戻し
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-500/20">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <p className="mt-3 text-xs text-zinc-400">Shopify GraphQL API からデータを取得中...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 text-center">
        <AlertCircle className="h-10 w-10 text-zinc-500" />
        <h3 className="mt-2 text-sm font-semibold text-zinc-200">注文が見つかりませんでした</h3>
        <p className="mt-1 text-xs text-zinc-400">検索条件を変更するか、フィルターをリセットしてください。</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-950/60 uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3.5 font-medium">注文番号 / 日時</th>
              <th className="px-4 py-3.5 font-medium">顧客情報</th>
              <th className="px-4 py-3.5 font-medium">配送先 / 配送方法</th>
              <th className="px-4 py-3.5 font-medium">購入商品 (明細)</th>
              <th className="px-4 py-3.5 font-medium">決済 / 発送状況</th>
              <th className="px-4 py-3.5 font-medium text-right">合計金額</th>
              <th className="px-4 py-3.5 font-medium text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {orders.map((order) => {
              const itemsCount = order.lineItems.reduce((acc, i) => acc + i.quantity, 0);
              const firstItemTitle = order.lineItems[0]?.title || "商品なし";

              return (
                <tr
                  key={order.id}
                  className="group hover:bg-zinc-800/40 transition-colors cursor-pointer"
                  onClick={() => onSelectOrder(order)}
                >
                  {/* Order Name & Date */}
                  <td className="px-4 py-4">
                    <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {order.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-400">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="font-medium text-zinc-200">
                          {order.customer?.displayName || "ゲストユーザー"}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[150px]">
                          {order.customer?.email || "メール未登録"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Shipping Info */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Truck className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate max-w-[160px]">
                        {order.shippingAddress
                          ? `${order.shippingAddress.province}${order.shippingAddress.city}`
                          : "配送先なし"}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-400 truncate max-w-[160px]">
                      {order.shippingLine?.title || "標準配送"}
                    </div>
                  </td>

                  {/* Products */}
                  <td className="px-4 py-4">
                    <div className="font-medium text-zinc-200 truncate max-w-[180px]">
                      {firstItemTitle}
                    </div>
                    {order.lineItems.length > 1 && (
                      <div className="text-[11px] text-zinc-400">
                        他 {order.lineItems.length - 1} 件 (全 {itemsCount} 点)
                      </div>
                    )}
                  </td>

                  {/* Status Badges */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      {renderFinancialBadge(order.displayFinancialStatus)}
                      {renderFulfillmentBadge(order.displayFulfillmentStatus)}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 text-right">
                    <div className="font-semibold text-white">
                      {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      内消費税 {formatPrice(order.totalTax.amount, order.totalTax.currencyCode)}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-zinc-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
                      title="注文詳細・商品・顧客・配送先を確認"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
