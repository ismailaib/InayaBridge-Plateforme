"use client"

import { useToast } from "@/lib/useToast"

import { Toast, ToastProvider, ToastViewport } from "./Toast"

const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {toasts.map(({ id, ...props }) => (
          <Toast key={id} {...props} className="pointer-events-auto" />
        ))}
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}

export { Toaster }