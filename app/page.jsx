import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-4xl font-bold">
          Welcome to General Affairs Dashboard
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Manage your organization's general affairs efficiently
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
