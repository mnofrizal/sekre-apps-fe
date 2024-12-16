"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function LoginForm({ onSubmit, error, isLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="p-6 md:p-0">
      <div className="mb-8 space-y-2">
        <h1 className="text-center text-2xl font-semibold">Welcome back</h1>
        <p className="text-center text-sm text-gray-500">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <div className="text-sm text-red-500">{error}</div>
          </div>
        )}

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            className="h-12 rounded-xl border-gray-200 px-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            className="h-12 rounded-xl border-gray-200 px-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-blue-600 text-base font-medium hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="space-x-1 pt-4 text-center">
          <span className="text-sm text-gray-500">Don't have an account?</span>
          <Link
            href="/register"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
