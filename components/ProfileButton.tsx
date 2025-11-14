"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function ProfileButton() {
  const { data: session } = authClient.useSession();
  async function handleLogout() {
    try {
      await authClient.signOut();
    } finally {
      window.location.href = "/login";
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg">
          {session?.user.image && (
            <Image
              src={session?.user.image}
              alt={session?.user.name ?? ""}
              width={34}
              height={34}
              className="rounded-full"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleLogout} variant="destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
