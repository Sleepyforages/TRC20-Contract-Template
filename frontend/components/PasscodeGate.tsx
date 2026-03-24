"use client";

import { useState, useRef, useEffect } from "react";
import { PASSCODE } from "@/utils/constants";

interface Props {
  onUnlock: () => void;
}

export default function PasscodeGate({ onUnlock }: Props) {
  const [code,    setCode]    = useState("");
  const [error,   setError]   = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    // Check if already unlocked in session
    if (typeof window !== "undefined" && sessionStorage.getItem("depofi_unlocked") === "1") {
      onUnlock();
    }
  }, [onUnlock]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSCODE) {
      sessionStorage.setItem("depofi_unlocked", "1");
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setCode("");
      setTimeout(() => setShaking(false), 600);
      setTimeout(() => setError(false),   2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand-gold/5 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-brand-green/5 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 mb-4">
            <span className="text-2xl font-bold text-brand-gold">D</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">
            <span className="text-brand-gold">Depo</span>
            <span className="text-white">Fi</span>
          </h1>
          <p className="text-brand-muted text-sm tracking-widest uppercase">
            Members Only
          </p>
        </div>

        {/* Tagline */}
        <div className="text-center mb-10">
          <p className="text-xl text-white/80 font-light">
            Invite-only USDT lending.
          </p>
          <p className="text-brand-gold font-semibold text-lg mt-1">
            Up to <span className="text-gold-glow text-2xl">16%</span> in 30 days.
          </p>
          <p className="text-brand-muted text-sm mt-2">
            On-chain · No intermediaries · Your keys, your funds
          </p>
        </div>

        {/* Gate */}
        <form onSubmit={submit} className="card p-6">
          <p className="text-brand-muted text-sm text-center mb-4">
            Enter your invite passcode to continue
          </p>
          <div
            className={`transition-transform duration-100 ${
              shaking ? "animate-[wiggle_0.5s_ease-in-out]" : ""
            }`}
            style={
              shaking
                ? { animation: "wiggle 0.5s ease-in-out" }
                : undefined
            }
          >
            <input
              ref={inputRef}
              type="password"
              className={`input text-center text-lg tracking-widest mb-3 ${
                error ? "border-brand-red/70 focus:border-brand-red" : ""
              }`}
              placeholder="••••••••"
              value={code}
              onChange={e => setCode(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {error && (
            <p className="text-brand-red text-xs text-center mb-3 animate-fade-in">
              Invalid passcode. Please check with your referrer.
            </p>
          )}
          <button type="submit" className="btn-primary w-full text-base">
            Enter
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-brand-muted text-xs">
            Not a member?{" "}
            <a href="/apply" className="text-brand-gold hover:underline">
              Apply for early access
            </a>
          </p>
          <p className="text-brand-dim text-xs">
            Tron blockchain · USDT TRC20 · Non-custodial
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes wiggle {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
