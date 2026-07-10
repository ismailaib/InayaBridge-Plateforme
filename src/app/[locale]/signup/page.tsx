"use client";

import { Conditions } from "@/app/Conditions";
import { Politique } from "@/app/Politique";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import useTranslations from "@/lib/i18n/useTranslations";
import { RiStethoscopeLine, RiUserHeartLine } from "@remixicon/react";
import { motion } from "framer-motion";
import { Frown, Smile } from "lucide-react";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import logo from "./../../icon-logo.png";

export default function RoleSelection() {
  const t = useTranslations("signup.roleSelection");
  const { locale } = useTranslationsContext();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      key: "doctor",
      label: t("doctor.label"),
      value: "doctor",
      icon: RiStethoscopeLine,
      description: t("doctor.description"),
      border: "border-[#3b82f6]",
    },
    {
      key: "patient",
      label: t("patient.label"),
      value: "patient",
      icon: RiUserHeartLine,
      description: t("patient.description"),
      border: "border-[#3b82f6]",
    },
  ] as const;

  const homeHref = `/${locale}`;
  const signupBase = `/${locale}/signup`;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-40 lg:px-6">
      <motion.div className="relative sm:w-full sm:max-w-2xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto w-fit rounded-xl bg-gray-50 p-4 shadow-md shadow-black/10 ring-1 ring-black/10 dark:bg-gray-900 dark:ring-gray-800"
        >
          <div className="w-fit rounded-lg bg-gradient-to-b from-[#3b82f6dc] to-[#3b82f6] p-3 shadow-sm shadow-[#3b82f6]/50 ring-1 ring-inset ring-white/25">
            <Image src={logo} alt="InayaBridge logo" width={24} height={24} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-xl font-semibold text-gray-900 dark:text-gray-50"
        >
          {t("title")}
        </motion.h2>

        {/* Role Cards */}
        <div className="mt-10 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2">
          {roles.map(
            ({ key, label, value, icon: Icon, description, border }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <Card
                  onClick={() => setSelectedRole(value)}
                  className={`flex h-full cursor-pointer flex-col justify-between border transition-all duration-200 ${
                    selectedRole === value
                      ? `ring-2 ring-[#3b82f6] ${border} shadow-md`
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                      <Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {label}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ),
          )}
        </div>

        {/* Buttons */}
        <motion.div
          className="flex w-full justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href={homeHref}>
            <Button
              type="button"
              variant="secondary"
              className="mt-12 flex w-fit flex-row justify-between gap-4 px-6"
            >
              {t("back")} <Frown />
            </Button>
          </Link>
          <Link
            href={selectedRole ? `${signupBase}/${selectedRole}` : signupBase}
            aria-disabled={!selectedRole}
            tabIndex={selectedRole ? 0 : -1}
          >
            <Button
              type="button"
              variant="secondary"
              disabled={!selectedRole}
              className="mt-12 flex w-fit flex-row justify-between gap-4 px-6"
            >
              {t("continue")} <Smile />
            </Button>
          </Link>
        </motion.div>

        {/* Conditions */}
        <div className="mt-4 flex justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
          {t("conditions")} <Conditions /> {t("and")} <Politique />.
        </div>
      </motion.div>
    </div>
  );
}
