"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { ArrowUpRight, Monitor, Moon, Sun } from "lucide-react";

import * as React from "react";

import { useTheme } from "next-themes";

export type DropdownUserProfileProps = {
  children: React.ReactNode;
  align?: "center" | "start" | "end";
};

export function DropdownUserProfile({
  children,
  align = "start",
}: DropdownUserProfileProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const t = useTranslations("common");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [localUser, setLocalUser] = React.useState<{ email: string } | null>(
    null,
  );

  React.useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch {
        setLocalUser(null);
      }
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const userEmail = localUser?.email || "ismailaitbouhmad@gmail.com";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="sm:!min-w-[calc(var(--radix-dropdown-menu-trigger-width))]"
      >
        <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSubMenu>
            <DropdownMenuSubMenuTrigger>
              {t("profile.theme")}
            </DropdownMenuSubMenuTrigger>
            <DropdownMenuSubMenuContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value);
                }}
              >
                <DropdownMenuRadioItem value="light" iconType="check">
                  <Sun className="size-4 shrink-0" aria-hidden="true" />
                  {t("profile.light")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" iconType="check">
                  <Moon className="size-4 shrink-0" aria-hidden="true" />
                  {t("profile.dark")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system" iconType="check">
                  <Monitor className="size-4 shrink-0" aria-hidden="true" />
                  {t("profile.system")}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubMenuContent>
          </DropdownMenuSubMenu>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            {t("profile.changelog")}
            <ArrowUpRight className="mb-1 ml-1 size-3 shrink-0 text-gray-500 dark:text-gray-500" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            {t("profile.docs")}
            <ArrowUpRight className="mb-1 ml-1 size-3 shrink-0 text-gray-500" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            {t("profile.community")}
            <ArrowUpRight className="mb-1 ml-1 size-3 shrink-0 text-gray-500" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <button
              onClick={() => {
                logout();
              }}
              className="w-full text-left"
            >
              {t("profile.logout")}
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
