"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnect from "./WalletConnect";
import type { WalletState } from "@/utils/types";
import clsx from "clsx";

interface Props {
  wallet: WalletState & {
    loading:    boolean;
    error:      string | null;
    connect:    () => void;
    disconnect: () => void;
  };
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/apply",     label: "Apply" },
];

export default function Navbar({ wallet }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-dark/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
            <span className="text-sm font-bold text-brand-gold">D</span>
          </div>
          <span className="font-bold text-white hidden sm:block">
            Depo<span className="text-brand-gold">Fi</span>
          </span>
          {wallet.isOwner && (
            <span className="text-[10px] font-medium bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-1.5 py-0.5 rounded-full">
              ADMIN
            </span>
          )}
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                pathname === link.href
                  ? "bg-brand-gold/10 text-brand-gold"
                  : "text-brand-muted hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Wallet */}
        <WalletConnect wallet={wallet} />
      </div>
    </header>
  );
}
