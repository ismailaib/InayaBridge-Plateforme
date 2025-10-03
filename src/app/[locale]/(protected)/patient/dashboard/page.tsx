"use client";

import { Card } from "@/components/Card";
import { MapPinCheck } from "lucide-react";

import React from "react";

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Bienvenue ..todo..
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-end">
            <div>
              <Card className="py-2 px-4 flex flex-row gap-2">
                <MapPinCheck /> Agadir ,Souss Massa
              </Card>
            </div>
          </div>
        </div>
      </header>

      <main></main>
    </div>
  );
}
