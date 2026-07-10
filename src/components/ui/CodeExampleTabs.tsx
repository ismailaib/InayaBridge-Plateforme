"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { RiCodeSSlashLine, RiShareForwardLine } from "@remixicon/react";

import Arrow from "../Arrow";

export default function CodeExampleTabs({
  tab1,
  tab2,
}: {
  tab1?: any;
  tab2?: any;
}) {
  return (
    <Tabs.Root
      className="mt-14 grid grid-cols-12 gap-8"
      defaultValue="tab1"
      orientation="vertical"
    >
      <Tabs.List
        className="col-span-full flex w-full flex-col gap-8 md:order-2 md:col-span-5"
        aria-label="Select code"
      >
        <Tabs.Trigger
          className="group relative flex flex-1 flex-col items-start justify-start rounded-xl p-6 text-left ring-1 ring-gray-200 dark:ring-white/5"
          value="tab1"
        >
          <div className="absolute -left-[36px] top-1/2 hidden -rotate-90 group-data-[state=active]:flex">
            <Arrow
              width={18}
              height={8}
              className="fill-gray-950 dark:fill-gray-900"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="aspect-square w-fit rounded-lg bg-white p-2 text-gray-700 ring-1 ring-black/10 transition-all group-data-[state=active]:text-[#3b82f6] dark:bg-gray-950 dark:text-gray-400 dark:ring-white/10 dark:group-data-[state=active]:text-[#3b82f6]">
              <RiShareForwardLine aria-hidden="true" className="size-5" />
            </div>
            <p className="font-semibold tracking-tight text-gray-700 transition-all group-data-[state=active]:text-[#3b82f6] sm:text-lg dark:text-gray-400 dark:group-data-[state=active]:text-[#3b82f6]">
              Intégration API dans vos systèmes
            </p>
          </div>
          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
            InayaBridge expose une API REST simple pour planifier des
            rendez-vous, accéder aux patients, et lancer des appels vidéo.
            Idéale pour connecter vos applications médicales, web ou mobiles.
          </p>
        </Tabs.Trigger>

        <Tabs.Trigger
          className="group relative flex flex-1 flex-col items-start justify-start rounded-xl p-6 text-left ring-1 ring-gray-200 dark:ring-white/5"
          value="tab2"
        >
          <div className="absolute -left-[36px] top-1/2 hidden -rotate-90 sm:group-data-[state=active]:flex">
            <Arrow
              width={18}
              height={8}
              className="fill-gray-950 dark:fill-gray-900"
            />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="aspect-square w-fit rounded-lg bg-white p-2 text-gray-700 ring-1 ring-black/10 transition-all group-data-[state=active]:text-[#3b82f6] dark:bg-gray-950 dark:text-gray-400 dark:ring-white/10 dark:group-data-[state=active]:text-[#3b82f6]">
              <RiCodeSSlashLine aria-hidden="true" className="size-5" />
            </div>
            <p className="font-semibold tracking-tight text-gray-700 transition-all group-data-[state=active]:text-[#3b82f6] sm:text-lg dark:text-gray-400 dark:group-data-[state=active]:text-[#3b82f6]">
              Exécution & Sécurité
            </p>
          </div>

          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
            Appels sécurisés via JWT, signalisation WebRTC custom, backend
            Node.js/Express et base MongoDB. Une architecture conçue pour la
            scalabilité, la rapidité et le respect du RGPD.
          </p>
        </Tabs.Trigger>
      </Tabs.List>

      <div className="col-span-full md:col-span-7">
        <Tabs.Content value="tab1">{tab1}</Tabs.Content>
        <Tabs.Content value="tab2">{tab2}</Tabs.Content>
      </div>
    </Tabs.Root>
  );
}
