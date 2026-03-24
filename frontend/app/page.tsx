"use client";

import { useRouter } from "next/navigation";
import PasscodeGate from "@/components/PasscodeGate";

export default function LandingPage() {
  const router = useRouter();

  const handleUnlock = () => {
    router.push("/dashboard");
  };

  return <PasscodeGate onUnlock={handleUnlock} />;
}
