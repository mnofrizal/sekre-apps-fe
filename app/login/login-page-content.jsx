"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPageContent() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push(decodeURIComponent(from));
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-t from-blue-50 to-rose-50">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/[0.3] via-transparent to-rose-100/[0.3] blur-3xl" />
      <div className="absolute z-10 w-full md:max-w-sm md:p-4">
        <div className="h-full w-full bg-white md:rounded-xl md:p-6 md:shadow-lg">
          <LoginForm
            onSubmit={handleLogin}
            error={error}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
