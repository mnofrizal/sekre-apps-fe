"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export function DashboardHeader() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          Hi, {session.user.name} <span className="wave">👋</span>
        </h1>
        <p className="text-muted-foreground">
          Welcome to General Affairs Suralaya
        </p>
      </div>
      <Avatar>
        <AvatarImage src="/avatar.png" alt={session.user.name} />
        <AvatarFallback>{session.user.name[0]}</AvatarFallback>
      </Avatar>
    </div>
  );
}
