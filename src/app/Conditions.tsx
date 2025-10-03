"use client";

import { Button } from "@/components/Button";
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
} from "@/components/Drawer";
import { useTranslations } from "@/lib/i18n/useTranslations";

export const Conditions = () => {
  const t = useTranslations("common");

  return (
    <div className="flex justify-center">
      <Drawer>
        <DrawerTrigger asChild>
          <a href="#" className="underline underline-offset-2">
            {t("conditionsContent.title")}
          </a>
        </DrawerTrigger>

        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{t("conditionsContent.title")}</DrawerTitle>
            <DrawerDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t("conditionsContent.description")}
            </DrawerDescription>
          </DrawerHeader>

          <DrawerBody className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <p>{t("conditionsContent.clause1Description")}</p>

            <p>
              <strong>{t("conditionsContent.clause4Title")}:</strong>{" "}
              {t("conditionsContent.clause4Description")}
            </p>

            <p>
              <strong>{t("conditionsContent.clause2Title")}:</strong>{" "}
              {t("conditionsContent.clause2Description")}
            </p>

            <p>
              <strong>{t("conditionsContent.clause3Title")}:</strong>{" "}
              {t("conditionsContent.clause3Description")}
            </p>

            <p>{t("conditionsContent.signature")}</p>
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
  );
};
