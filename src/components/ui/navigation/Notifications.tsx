'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Bell, Gift, HeartHandshake, ListChecks, Star } from 'lucide-react'
import { cx } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/Tabs'
import { getnotifications } from './api/Notifications'

const WelcomeNotificationCard = ({ notification }: { notification: any }) => {
  return (
    <li className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-emerald-900/20 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 p-4 hover:shadow-md transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-2 -mr-2">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full opacity-20" />
      </div>
      <div className="absolute bottom-0 left-0 -mb-1 -ml-1">
        <div className="w-6 h-6 bg-gradient-to-tr from-emerald-400 to-emerald-400 rounded-full opacity-15" />
      </div>

      <div className="relative flex items-start gap-3">
        {/* Welcome Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
            <HeartHandshake className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Welcome Title */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
              Bienvenue ! 🎉
            </h4>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Nous sommes ravis de vous avoir parmi nous !
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {(  new Date(notification.createdAt)).toLocaleDateString('fr-FR')}
            </span>
            {!notification.read && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Nouveau
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />
      </div>
    </li>
  )
}

// Standard Notification Card Component
const StandardNotificationCard = ({ notification }: { notification: any }) => {
  return (
    <li className="flex items-start gap-2 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300">
      <span className="inline-block mt-1">
        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
      </span>
      <div>
        <p className="text-sm text-gray-800 dark:text-gray-200">
          {notification.message}
        </p>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {notification.createdAt}
        </span>
      </div>
    </li>
  )
}


const Notifications = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true)
    getnotifications(user.id)
      .then(res => setNotifications(res.data || []))
      .catch(err => console.error('Error fetching notifications', err))
      .finally(() => setLoading(false))
  }, [user?.id])
  const renderNotification = (notification: any) => {
    if (notification.type === 'WELCOME') {
      return <WelcomeNotificationCard key={notification.id} notification={notification} />
    }
    return <StandardNotificationCard key={notification.id} notification={notification} />
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <button
            data-sidebar="trigger"
            className={cx(
              'group inline-flex rounded-md p-1.5 hover:bg-gray-200/50 hover:dark:bg-gray-900',
            )}
          >
            <Bell
              className="size-[18px] shrink-0 text-gray-700 dark:text-gray-300"
              aria-hidden="true"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-4 z-50 lg:mr-8">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <div className="flex flex-row items-center justify-between gap-4">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  Notifications
                </p>
                <button
                  className={cx(
                    'group inline-flex rounded-md p-1.5 py-0.5 hover:bg-gray-200/50 hover:dark:bg-gray-900',
                  )}
                >
                  <ListChecks width={18} />
                </button>
              </div>

              <Tabs defaultValue="tab1">
                <TabsList className="grid w-full grid-cols-2" variant="solid">
                  <TabsTrigger value="tab1">Non lues</TabsTrigger>
                  <TabsTrigger value="tab2">Toutes</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <TabsContent value="tab1">
                    {loading ? (
                      <p className="text-sm text-gray-500">Chargement...</p>
                    ) : notifications.filter(n => !n.read).length ? (
                      <ul className="space-y-2">
                        {notifications
                          .filter(n => !n.read)
                          .map(renderNotification)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Aucune notification non lue</p>
                    )}
                  </TabsContent>

                  <TabsContent value="tab2">
                    {loading ? (
                      <p className="text-sm text-gray-500">Chargement...</p>
                    ) : notifications.length ? (
                      <ul className="space-y-2">
                        {notifications.map(renderNotification)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Aucune notification</p>
                    )}
                  </TabsContent>
                </div>
              </Tabs>

              <div className="flex w-full justify-center">
                <Button variant="secondary" className="flex flex-row gap-2 w-full">
                  Voir toutes les notifications
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Notifications
