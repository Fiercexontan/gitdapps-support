"use client";

import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useSIWE() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const signIn = async () => {
    try {
      setLoading(true);
      setError("");

      const nonceRes = await fetch("/api/auth/nonce");
      const { nonce } = await nonceRes.json();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to GitDapps with your wallet.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.prepareMessage(),
          signature,
        }),
      });

      const result = await verifyRes.json();

      if (result.ok) {
        window.location.href = "/dashboard";
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      setError("Signing cancelled or failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return { signIn, signOut, loading, error };
}