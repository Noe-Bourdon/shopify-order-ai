"use client";

import { useState } from "react";
import { X, Key, Globe, Check, AlertCircle, RefreshCw } from "lucide-react";

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCredentials: (domain: string, token: string) => void;
  currentDomain?: string;
  currentToken?: string;
}

export default function CredentialsModal({
  isOpen,
  onClose,
  onSaveCredentials,
  currentDomain = "",
  currentToken = "",
}: CredentialsModalProps) {
  const [domain, setDomain] = useState(currentDomain);
  const [token, setToken] = useState(currentToken);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCredentials(domain.trim(), token.trim());
    onClose();
  };

  const handleResetToMock = () => {
    setDomain("");
    setToken("");
    onSaveCredentials("", "");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Shopify API 接続設定</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <p className="text-zinc-400">
            Shopify Admin API アクセストークンとストアのドメインを設定することで、実環境のShopify注文情報を直接取得できます。
          </p>

          <div>
            <label className="block font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              Shopify ストアドメイン
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example-store.myshopify.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-zinc-400" />
              Admin API アクセストークン (shpat_...)
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-zinc-400">
            <div className="flex items-center gap-1.5 font-medium text-zinc-300 mb-1">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              必要な Access Scopes
            </div>
            `read_orders`, `read_customers`
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleResetToMock}
              className="text-amber-400 hover:underline"
            >
              デモモックモードに戻す
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-medium text-zinc-300 hover:bg-zinc-800"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-1.5 font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
              >
                保存して接続
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
