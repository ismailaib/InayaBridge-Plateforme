"use client"

import { DateRangePicker } from '@/components/DatePicker'
import { Label } from '@/components/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import Table from './Table'
import { Input } from '@/components/Input'
import { useTranslations } from '@/lib/i18n/useTranslations'

export default function Example({ refreshKey }: { refreshKey: number }) {
  const t = useTranslations("patients.filter")

  return (
    <div className="relative">
      <div className="rounded-lg border border-gray-200 bg-white pb-20 dark:border-gray-800 dark:bg-gray-950 h-full">
        <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-6 dark:border-gray-800 sm:grid-cols-2 md:grid-cols-4">
          
          {/* 🔍 Filtrer */}
          <div className="w-full">
            <Label htmlFor="search_filter" className="font-medium">
              {t("filter")}
            </Label>
            <Input placeholder={t("searchPlaceholder")} className="mt-2" />
          </div>

          {/* 🎂 Date naissance */}
          <div className="w-full">
            <Label htmlFor="dob_filter" className="font-medium">
              {t("dob")}
            </Label>
            <DateRangePicker
              id="dob_filter"
              defaultValue={{
                from: new Date(new Date().setFullYear(new Date().getFullYear() - 50)),
                to: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
              }}
              className="mt-2"
            />
          </div>

          {/* 👤 Genre */}
          <div className="w-full">
            <Label htmlFor="gender_filter" className="font-medium">
              {t("gender")}
            </Label>
            <Select defaultValue="all">
              <SelectTrigger id="gender_filter" name="gender_filter" className="mt-2 sm:w-full">
                <SelectValue placeholder={t("select")} />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "all", label: t("all") },
                  { value: "male", label: t("male") },
                  { value: "female", label: t("female") },
                ].map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ⏳ Dernière visite */}
          <div className="w-full">
            <Label htmlFor="sort_filter" className="font-medium">
              {t("lastVisit")}
            </Label>
            <Select defaultValue="desc">
              <SelectTrigger id="sort_filter" name="sort_filter" className="mt-2 sm:w-full">
                <SelectValue placeholder={t("sort")} />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "desc", label: t("recent") },
                  { value: "asc", label: t("oldest") },
                ].map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table refreshKey={refreshKey} />
      </div>
    </div>
  )
}
