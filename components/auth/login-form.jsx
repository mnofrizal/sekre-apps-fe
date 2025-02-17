"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function LoginForm({ onSubmit, error, isLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

        <div className="relative space-y-2">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-12 rounded-xl border-gray-200 px-4 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 transform hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>

        <div className="flex justify-end">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Forgot password?
          </span>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-indigo-600 text-base font-medium hover:bg-indigo-700"
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
          <span className="text-sm text-gray-500">
            © General Affair Suralaya 2025
          </span>
        </div>
      </form>
    </div>
  );
}
