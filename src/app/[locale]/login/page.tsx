"use client";

import { login as loginApi } from "@/api/login";
import { Conditions } from "@/app/Conditions";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { extractApiError } from "@/helpers/extractApiError";
import { useAuth } from "@/lib/auth-context";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useToast } from "@/lib/useToast";
import { useUserStore } from "@/store/useAuthStore";
import { RiArrowRightSLine } from "@remixicon/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../../icon-logo.png";

export default function LoginPage() {
  const t = useTranslations("auth");
  const c = useTranslations("common");
  const { locale } = useTranslationsContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { login, token, user, loading: authLoading } = useAuth();
  const { setUser } = useUserStore() as { setUser: (user: unknown) => void };
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    console.log("[LoginPage] Mounted");
  }, []);

  useEffect(() => {
    console.log("[LoginPage] Auth state", {
      authLoading,
      mounted,
      hasToken: Boolean(token),
      hasUser: Boolean(user),
      user,
    });

    if (!authLoading && token && user && mounted) {
      console.log("[LoginPage] Redirecting user", { role: user.role });

      if (user.role === "DOCTOR") {
        router.replace(`/${locale}/dashboard`);
      } else if (user.role === "PATIENT") {
        router.replace(`/${locale}/patient/dashboard`);
      }
    }
  }, [authLoading, locale, mounted, router, token, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    console.log("[LoginPage] Form submitted", { email });

    try {
      const { data } = await loginApi({ email, password });
      console.log("[LoginPage] loginApi success", data);

      login({ token: data.token, user: data.user });
      setUser(data.user);
    } catch (error) {
      console.error("[LoginPage] loginApi error", error);
      toast({
        title: "Erreur",
        description: extractApiError(error),
        variant: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading) {
    console.log("[LoginPage] Showing loading skeleton", { mounted, authLoading });
    return (
      <div className="grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="flex h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-12">
          <div className="flex w-full max-w-xl flex-col gap-8">
            <div className="animate-pulse">
              <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mounted && token && user) {
    console.log("[LoginPage] Authenticated, skipping form", { token, user });
    return null;
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-2">
      <div className="flex h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-12">
        <div className="flex w-full max-w-xl flex-col gap-8">
          <div className="flex flex-row items-center justify-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-fit rounded-xl bg-gray-50 p-4 shadow-md shadow-black/10 ring-1 ring-black/10 dark:bg-gray-900 dark:ring-gray-800"
            >
              <div className="w-fit rounded-lg bg-gradient-to-b from-[#3b82f6dc] to-[#3b82f6] p-3 ring-1 ring-white/25">
                <Image src={logo} alt="InayaBridge Logo" width={24} height={24} />
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
          </motion.div>

          <form className="space-y-5 text-start" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2"
                placeholder={t("passwordPlaceholder")}
                autoComplete="current-password"
              />
            </div>

            <div className="mt-4 flex flex-col items-center justify-start gap-1 text-xs text-gray-500 dark:text-gray-500 sm:flex-row sm:gap-1">
              <span>{c("conditions")}&nbsp;</span>
              <Conditions />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Link href={`/${locale}/signup`}>
                <Button variant="secondary" type="button">
                  {t("createAccount")}
                </Button>
              </Link>
              <Button
                variant="primary"
                type="submit"
                className="w-full"
                isLoading={loading}
                loadingText={t("loginLoading")}
              >
                {t("login")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <motion.aside
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-1 hidden h-full overflow-hidden border-l border-r border-gray-400/20 p-6 lg:flex"
        aria-label="Illustration"
      >
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="max-w-md">
            <div>
              <h2 className="font-mono text-sm text-gray-700 dark:text-gray-300">{t("aside.updateTitle")}</h2>
              <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
                {t("aside.updateDescription")}
              </p>
            </div>

            <div className="relative mt-6 h-64 max-w-[450px] overflow-hidden rounded-xl bg-gradient-to-br from-[#3b82f6]/80 to-[#3b82f6]/20 p-6 shadow-lg shadow-black/10">
              <div className="flex h-full flex-col justify-between text-white">
                <p className="text-2xl font-semibold">{t("aside.releaseName")}</p>
                <p className="text-lg">{t("aside.releaseYear")}</p>
              </div>
            </div>

            <Link
              href={`/${locale}/changelog`}
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#3b82f6] hover:underline hover:underline-offset-4"
            >
              {t("aside.discover")}
              <RiArrowRightSLine className="size-5 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
