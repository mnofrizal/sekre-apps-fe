"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [email, setEmail] = useState("admin@msdm.app");
  const [password, setPassword] = useState("12345");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation for dummy credentials
    if (email === "admin@msdm.app" && password === "12345") {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials. Use admin@msdm.app and 12345");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center md:bg-gray-50">
      <div className="w-full md:max-w-sm md:p-4">
        <div className="h-full w-full bg-white md:rounded-xl md:p-6 md:shadow-lg">
          <div className="p-6 md:p-0">
            <div className="mb-8 space-y-2">
              <h1 className="text-center text-2xl font-semibold">
                Welcome back
              </h1>
              <p className="text-center text-sm text-gray-500">
                Sign in to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-center text-sm text-red-500">{error}</div>
              )}

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className="h-12 rounded-xl border-gray-200 px-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                onClick={() => history.push("/dashboard")}
                className="h-12 w-full rounded-xl bg-blue-600 text-base font-medium hover:bg-blue-700"
              >
                Sign in
              </Button>

              <div className="space-x-1 pt-4 text-center">
                <span className="text-sm text-gray-500">
                  Don't have an account?
                </span>
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
