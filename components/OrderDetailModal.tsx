"use client";

import { useState } from "react";
import { ShopifyOrder } from "@/types/shopify";
import {
  X,
  User,
  MapPin,
  Truck,
  ShoppingBag,
  CreditCard,
  Code,
  FileText,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

interface OrderDetailModalProps {
  order: ShopifyOrder | null;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "raw">("details");
  const [copied, setCopied] = useState(false);

  if (!order) return null;

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
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const copyJson = () => {
    if (!order.rawGraphQLNode && !order) return;
    const jsonStr = JSON.stringify(order.rawGraphQLNode || order, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>注文詳細 {order.name}</span>
              </h2>
              <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-400">
                {order.id}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              注文受領日時: {formatDate(order.createdAt)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Pills Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-900/60 p-3 border border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">支払い状態:</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {order.displayFinancialStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">配送ステータス:</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30">
              <Truck className="h-3.5 w-3.5" />
              {order.displayFulfillmentStatus}
            </span>
          </div>

          {/* Tab Selection */}
          <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === "details"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              注文全容
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === "raw"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              GraphQL JSON
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "details" ? (
          <div className="mt-6 space-y-6 max-h-[65vh] overflow-y-auto pr-1">
            {/* Customer & Shipping Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Info Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 text-emerald-400 font-semibold text-sm">
                  <User className="h-4 w-4" />
                  <span>顧客情報 (Customer)</span>
                </div>
                {order.customer ? (
                  <div className="mt-3 space-y-2 text-xs text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">
                        {order.customer.displayName}
                      </span>
                      {order.customer.ordersCount !== undefined && (
                        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                          通算 {order.customer.ordersCount} 回注文
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mail className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{order.customer.email || "メールアドレスなし"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Phone className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{order.customer.phone || "電話番号なし"}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 pt-1">
                      ID: {order.customer.id}
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-zinc-500">顧客情報なし (ゲスト購入)</p>
                )}
              </div>

              {/* Shipping Address & Method Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 text-blue-400 font-semibold text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>配送先住所 & 配送方法</span>
                </div>
                {order.shippingAddress ? (
                  <div className="mt-3 space-y-2 text-xs text-zinc-300">
                    <div className="font-semibold text-white">
                      受取人: {order.shippingAddress.name}
                    </div>
                    {order.shippingAddress.company && (
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{order.shippingAddress.company}</span>
                      </div>
                    )}
                    <div className="text-zinc-300">
                      〒{order.shippingAddress.zip} {order.shippingAddress.province}{order.shippingAddress.city}{order.shippingAddress.address1} {order.shippingAddress.address2 || ""}
                    </div>
                    {order.shippingAddress.phone && (
                      <div className="text-zinc-400">
                        TEL: {order.shippingAddress.phone}
                      </div>
                    )}
                    {/* Shipping Line */}
                    <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <Truck className="h-3.5 w-3.5 text-blue-400" />
                        {order.shippingLine?.title || "標準配送"}
                      </span>
                      <span className="font-medium text-white">
                        {order.shippingLine
                          ? formatPrice(order.shippingLine.price.amount, order.shippingLine.price.currencyCode)
                          : "¥0"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-zinc-500">配送先情報が指定されていません</p>
                )}
              </div>
            </div>

            {/* Note if present */}
            {order.note && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs text-amber-200">
                <span className="font-semibold">注文備考・メモ:</span> {order.note}
              </div>
            )}

            {/* Line Items Table */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
              <div className="flex items-center gap-2 bg-zinc-900 px-4 py-3 border-b border-zinc-800 text-sm font-semibold text-white">
                <ShoppingBag className="h-4 w-4 text-emerald-400" />
                <span>購入商品一覧 ({order.lineItems.length} 点)</span>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {order.lineItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 text-xs">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-12 w-12 rounded-lg object-cover border border-zinc-800 bg-zinc-900"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-500">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-zinc-100 text-sm">{item.title}</div>
                        {item.variantTitle && (
                          <div className="text-zinc-400 mt-0.5">{item.variantTitle}</div>
                        )}
                        {item.sku && (
                          <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                            SKU: {item.sku}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-zinc-400">
                        {formatPrice(item.unitPrice.amount, item.unitPrice.currencyCode)} × {item.quantity} 個
                      </div>
                      <div className="font-semibold text-white text-sm mt-0.5">
                        {formatPrice(item.totalPrice.amount, item.totalPrice.currencyCode)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown Footer */}
              <div className="border-t border-zinc-800 bg-zinc-950/80 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>小計 (Subtotal)</span>
                  <span>{formatPrice(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>配送料 (Shipping)</span>
                  <span>{formatPrice(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>消費税 (Tax)</span>
                  <span>{formatPrice(order.totalTax.amount, order.totalTax.currencyCode)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                  <span>合計支払い金額 (Total)</span>
                  <span className="text-emerald-400">
                    {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Raw GraphQL Node Tab */
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                Shopify Admin GraphQL API のレスポンスノード構造
              </span>
              <button
                onClick={copyJson}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "コピーしました" : "JSONをコピー"}</span>
              </button>
            </div>
            <pre className="max-h-[55vh] overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 font-mono text-xs text-emerald-300">
              {JSON.stringify(order.rawGraphQLNode || order, null, 2)}
            </pre>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 border-t border-zinc-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
