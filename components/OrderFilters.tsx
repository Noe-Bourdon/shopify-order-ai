"use client";

import { Search, Filter, RefreshCw, Layers } from "lucide-react";
import { DisplayFinancialStatus, DisplayFulfillmentStatus } from "@/types/shopify";

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  financialFilter: string;
  onFinancialFilterChange: (status: string) => void;
  fulfillmentFilter: string;
  onFulfillmentFilterChange: (status: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function OrderFilters({
  searchTerm,
  onSearchChange,
  financialFilter,
  onFinancialFilterChange,
  fulfillmentFilter,
  onFulfillmentFilterChange,
  onRefresh,
  isLoading,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="注文番号 (#1001)、顧客名、メール、商品名、SKU、住所で検索..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Financial Status */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          <button
            onClick={() => onFinancialFilterChange("ALL")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              financialFilter === "ALL"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            決済全件
          </button>
          <button
            onClick={() => onFinancialFilterChange("PAID")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              financialFilter === "PAID"
                ? "bg-emerald-500/20 text-emerald-300"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            決済済
          </button>
          <button
            onClick={() => onFinancialFilterChange("PENDING")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              financialFilter === "PENDING"
                ? "bg-amber-500/20 text-amber-300"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            未決済
          </button>
          <button
            onClick={() => onFinancialFilterChange("REFUNDED")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              financialFilter === "REFUNDED"
                ? "bg-purple-500/20 text-purple-300"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            返金済
          </button>
        </div>

        {/* Fulfillment Status Select */}
        <select
          value={fulfillmentFilter}
          onChange={(e) => onFulfillmentFilterChange(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-950 py-1.5 px-3 text-xs font-medium text-zinc-300 focus:border-emerald-500 focus:outline-none"
        >
          <option value="ALL">発送状況: すべて</option>
          <option value="UNFULFILLED">未発送 (UNFULFILLED)</option>
          <option value="FULFILLED">発送完了 (FULFILLED)</option>
          <option value="PARTIALLY_FULFILLED">一部発送 (PARTIALLY)</option>
          <option value="RESTOCKED">返品在庫化 (RESTOCKED)</option>
        </select>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          title="GraphQL APIデータを再取得"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          <span className="hidden sm:inline">更新</span>
        </button>
      </div>
    </div>
  );
}
