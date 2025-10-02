"use client"

import { Button } from '@/components/Button'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer'
import { ClipboardMinus, GitPullRequestCreateArrow } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from "@/lib/i18n/useTranslations"

const TransfertDrawer = () => {
  const t = useTranslations("appointments.waitingRoom.drawer")
  const hasAppointmentsToday = false // logique à remplacer par de la data

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button>{t("openButton")}</Button>
        </DrawerTrigger>
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{t("title")}</DrawerTitle>
            <DrawerDescription className="mt-1 text-sm">
              {t("description")}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            {!hasAppointmentsToday ? (
              <div className="flex flex-col gap-2 text-center space-y-4 h-full justify-center items-center">
                <ClipboardMinus width={128} height={128} className='text-gray-300'/>
                <p className="text-sm text-muted-foreground">
                  {t("noAppointments")}
                </p>
                <Link href="/appointment/create">
                  <Button className='flex flex-row gap-2'>
                    <GitPullRequestCreateArrow /> {t("createAppointment")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div>{t("hasAppointmentsContent")}</div>
            )}
          </DrawerBody>
          <DrawerFooter className="mt-6">
            <DrawerClose asChild>
              <Button
                className="mt-2 w-full sm:mt-0 sm:w-fit"
                variant="secondary"
              >
                {t("back")}
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="w-full sm:w-fit">{t("validate")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default TransfertDrawer
