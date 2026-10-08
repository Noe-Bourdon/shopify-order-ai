"use client";

import { ShoppingBag, Code, Settings, ShieldCheck, Database } from "lucide-react";

interface NavbarProps {
  isMock: boolean;
  isLocalGraphQL?: boolean;
  onOpenGraphQLModal: () => void;
  onOpenCredentialsModal: () => void;
}

export default function Navbar({
  isMock,
  isLocalGraphQL = false,
  onOpenGraphQLModal,
  onOpenCredentialsModal,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Shopify Order AI
              </h1>
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                GraphQL Admin API
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              注文・顧客・配送先・商品明細 統合ダッシュボード
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mode Indicator */}
          <div className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
            isLocalGraphQL
              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
              : isMock
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          }`}>
            <Database className="h-3.5 w-3.5" />
            <span>
              {isLocalGraphQL
                ? "ローカル Shopify GraphQL API (通信中)"
                : isMock
                ? "デモ用モックデータ"
                : "Shopify 実環境接続"}
            </span>
          </div>

          {/* View GraphQL Query */}
          <button
            onClick={onOpenGraphQLModal}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 transition-all"
          >
            <Code className="h-4 w-4 text-emerald-400" />
            <span>GraphQLクエリを確認</span>
          </button>

          {/* API Settings */}
          <button
            onClick={onOpenCredentialsModal}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 transition-all"
          >
            <Settings className="h-4 w-4 text-zinc-400" />
            <span className="hidden md:inline">API接続設定</span>
          </button>
        </div>
      </div>
    </header>
  );
}
