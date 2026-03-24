"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useWallet } from "@/hooks/useWallet";

export default function ApplyPage() {
  const wallet = useWallet();

  return (
    <div className="min-h-screen">
      <Navbar wallet={wallet} />

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Closed Beta
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Apply as a
            <br />
            <span className="text-brand-gold">Business Borrower</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-xl mx-auto">
            DepoFi is an invite-only protocol. Businesses are manually vetted before
            a loan offer is created on-chain. No collateral required — your reputation
            and relationship with our network is your credit.
          </p>
        </div>

        {/* What we look for */}
        <div className="card p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">What we look for</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🏢", title: "Established business",  desc: "Minimum 12 months operating history with verifiable revenue." },
              { icon: "📈", title: "Clear use of funds",    desc: "Specific short-term capital need — inventory, receivables, bridge." },
              { icon: "🤝", title: "Network referral",      desc: "Introduced by an existing DepoFi participant or partner." },
              { icon: "🔐", title: "Tron wallet",           desc: "Active Tron wallet (TronLink) you control. KYC via partner channel." },
            ].map(item => (
              <div key={item.title} className="flex gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{item.title}</p>
                  <p className="text-brand-muted text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loan terms */}
        <div className="card p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">Available Loan Terms</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { days: 7,  reward: "3%"  },
              { days: 14, reward: "7%"  },
              { days: 21, reward: "11%" },
              { days: 30, reward: "16%" },
            ].map(tier => (
              <div key={tier.days} className="bg-brand-dark border border-brand-border rounded-xl p-4 text-center">
                <p className="text-brand-gold font-bold text-2xl">{tier.reward}</p>
                <p className="text-white font-medium text-sm">{tier.days} days</p>
                <p className="text-brand-muted text-xs mt-0.5">flat cost</p>
              </div>
            ))}
          </div>
          <p className="text-brand-muted text-xs mt-3">
            All costs are flat, not annualised. You repay principal + the above % after
            your term. Early repayment is possible — lenders can claim any time after maturity
            if liquidity is present.
          </p>
        </div>

        {/* Process */}
        <div className="card p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">The Process</h2>
          <ol className="space-y-4">
            {[
              {
                n: "01",
                title: "Off-chain application",
                desc: "Fill out the form below (or reach out via Telegram). Share your business details, loan amount, and intended use.",
              },
              {
                n: "02",
                title: "Manual review",
                desc: "Our team reviews your application within 48–72 hours. We verify your background through our partner network.",
              },
              {
                n: "03",
                title: "Loan offer deployed",
                desc: "If approved, a smart contract pool is deployed with your wallet as the designated borrower. Lenders can then deposit.",
              },
              {
                n: "04",
                title: "Funds disbursed",
                desc: "Once the pool is 100% funded, you withdraw principal directly on-chain. No intermediaries.",
              },
              {
                n: "05",
                title: "Repayment",
                desc: "After your term, you deposit principal + reward back into the pool contract. Lenders claim automatically.",
              },
            ].map(step => (
              <li key={step.n} className="flex gap-4">
                <span className="shrink-0 font-mono text-brand-gold font-bold text-sm pt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="text-white font-medium text-sm">{step.title}</p>
                  <p className="text-brand-muted text-xs mt-0.5">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="card p-6 border-brand-gold/20 bg-brand-gold/5 text-center">
          <h2 className="text-white font-semibold text-lg mb-2">Ready to Apply?</h2>
          <p className="text-brand-muted text-sm mb-4">
            Reach out through our private Telegram channel with a brief introduction
            and your loan requirements. All communication is confidential.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://t.me/depofi_apply"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <span>Apply via Telegram</span>
            </a>
            <Link href="/dashboard" className="btn-outline inline-flex items-center justify-center">
              Back to Dashboard
            </Link>
          </div>
          <p className="text-brand-dim text-xs mt-4">
            Applications reviewed manually. Response within 48–72 hours.
          </p>
        </div>
      </main>
    </div>
  );
}
