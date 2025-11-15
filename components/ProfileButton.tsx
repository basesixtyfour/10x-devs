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
import { useEffect, useState } from "react";

export function ProfileButton() {
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    try {
      await authClient.signOut();
    } finally {
      window.location.href = "/login";
    }
  }

  const buttonContent = (
    <Button variant="ghost" size="icon-lg">
      {session?.user.image && (
        <Image
          src={session?.user.image}
          alt={session?.user.name ?? ""}
          width={34}
          height={34}
          className="rounded-full cursor-pointer"
        />
      )}
    </Button>
  );

  if (!mounted) {
    return buttonContent;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{buttonContent}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleLogout} variant="destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
