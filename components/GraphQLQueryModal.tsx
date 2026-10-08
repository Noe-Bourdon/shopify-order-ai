"use client";

import { useState } from "react";
import { X, Copy, Check, Terminal, ExternalLink } from "lucide-react";
import { SHOPIFY_ADMIN_ORDERS_GRAPHQL_QUERY } from "@/lib/shopify";

interface GraphQLQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GraphQLQueryModal({ isOpen, onClose }: GraphQLQueryModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyQuery = () => {
    navigator.clipboard.writeText(SHOPIFY_ADMIN_ORDERS_GRAPHQL_QUERY.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">
                Shopify Admin GraphQL API クエリ構造
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              注文一覧・注文詳細・商品明細・顧客・配送先・配送方法・決済/発送ステータスを一括取得するクエリ
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-emerald-300">
          <strong>GraphQL API の利点:</strong> REST API のように複数回リクエストを発行する（N+1問題）ことなく、1回のリクエストでネストされた全データを過不足なく取得できます。
        </div>

        {/* Code View */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              GraphQL Query (Admin API 2024-04)
            </span>
            <button
              onClick={copyQuery}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "コピー完了" : "クエリをコピー"}</span>
            </button>
          </div>

          <pre className="max-h-[50vh] overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 font-mono text-xs leading-relaxed text-zinc-200">
            {SHOPIFY_ADMIN_ORDERS_GRAPHQL_QUERY.trim()}
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-zinc-800 pt-4 flex items-center justify-between text-xs text-zinc-400">
          <a
            href="https://shopify.dev/docs/api/admin-graphql/latest/queries/orders"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:underline"
          >
            Shopify Dev 公式ドキュメントを見る
            <ExternalLink className="h-3 w-3" />
          </a>

          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
