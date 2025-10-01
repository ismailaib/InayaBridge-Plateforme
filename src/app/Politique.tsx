"use client"

import { Button } from "@/components/Button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Drawer"
import useTranslations from "@/lib/i18n/useTranslations"

export const Politique = () => {
  const t = useTranslations("common.policy")

  return (
    <div className="flex justify-center">
      <Drawer>
        <DrawerTrigger asChild>
          <a href="#" className="underline underline-offset-2">
            {t("link")}
          </a>
        </DrawerTrigger>
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{t("title")}</DrawerTitle>
            <DrawerDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t("description")}
            </DrawerDescription>
          </DrawerHeader>

          <DrawerBody className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <p>{t("intro")}</p>

            <p>
              <strong>{t("collected.title")}</strong> {t("collected.text")}
            </p>

            <p>
              <strong>{t("usage.title")}</strong> {t("usage.text")}
            </p>

            <p>
              <strong>{t("storage.title")}</strong> {t("storage.text")}
            </p>

            <p>
              <strong>{t("sharing.title")}</strong> {t("sharing.text")}
            </p>

            <p>{t("rights")}</p>
          </DrawerBody>

          <DrawerFooter className="mt-6">
            <DrawerClose asChild>
              <Button variant="secondary" className="w-full sm:w-fit">
                {t("close")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
