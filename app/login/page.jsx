import { Suspense } from "react";
import LoginPageContent from "./login-page-content";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center md:bg-gray-50">
          <div className="w-full md:max-w-sm md:p-4">
            <div className="h-full w-full bg-white md:rounded-xl md:p-6 md:shadow-lg">
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
