"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/RadioCard";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import useTranslations from "@/lib/i18n/useTranslations";

import { useState } from "react";

import Link from "next/link";

type SpecialityOption = {
  id: string;
  label: string;
};

export default function StepDoctorSpecialisation({
  selected,
  onContinue,
  onSuccess,
}: {
  selected?: string;
  onContinue: (spec: string) => void;
  onSuccess?: () => void;
}) {
  const t = useTranslations("signup.doctor.specialisation");
  const { locale } = useTranslationsContext();
  const options = t.raw<SpecialityOption[]>("options") ?? [];
  const otherOption = options.find((option) => option.id === "other");

  const defaultChoice = selected ?? options[0]?.label ?? "";
  const [choice, setChoice] = useState(defaultChoice);
  const [other, setOther] = useState("");

  const isOtherSelected = otherOption && choice === otherOption.label;
  const current = isOtherSelected ? other : choice;
  const valid = current.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    onContinue(current.trim());
    onSuccess?.();
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset>
          <RadioCardGroup className="mt-4 grid-cols-2">
            {options.map((option) => (
              <RadioCardItem
                key={option.id}
                value={option.id}
                checked={choice === option.label}
                onClick={() => setChoice(option.label)}
              >
                <div className="flex items-center gap-3">
                  <RadioCardIndicator />
                  <span>{option.label}</span>
                </div>
              </RadioCardItem>
            ))}
          </RadioCardGroup>

          {isOtherSelected && (
            <div className="mt-6">
              <label htmlFor="other" className="mb-1 block text-sm font-medium">
                {t("otherFieldLabel")}
              </label>
              <Input
                id="other"
                placeholder={t("otherPlaceholder")}
                value={other}
                onChange={(e) => setOther(e.target.value)}
              />
            </div>
          )}
        </fieldset>

        <div className="mt-12 flex justify-between gap-4">
          <Link href={`/${locale}/signup`}>
            <Button variant="secondary" type="button">
              {t("back")}
            </Button>
          </Link>

          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={!valid}
          >
            {t("continue")}
          </Button>
        </div>
      </form>
    </div>
  );
}
