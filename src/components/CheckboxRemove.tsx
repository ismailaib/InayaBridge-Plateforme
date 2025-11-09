// Tremor Checkbox [v1.0.0]

import React from "react"
import * as CheckboxPrimitives from "@radix-ui/react-checkbox"
import { cx, focusRing } from "@/lib/utils"

const CheckboxRemove = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>
>(({ className, checked, ...props }, forwardedRef) => {
  return (
    <CheckboxPrimitives.Root
      ref={forwardedRef}
      {...props}
      checked={checked}
      className={cx(
        "relative inline-flex size-4 shrink-0 appearance-none items-center justify-center rounded-sm shadow-xs outline-hidden ring-1 ring-inset transition duration-100 enabled:cursor-pointer",
        "text-white dark:text-gray-50",
        "bg-white dark:bg-gray-950",
        "ring-gray-300 dark:ring-gray-800",
        "data-disabled:bg-gray-100 data-disabled:text-gray-400 data-disabled:ring-gray-300",
        "dark:data-disabled:bg-gray-800 dark:data-disabled:text-gray-500 dark:data-disabled:ring-gray-700",
        "enabled:data-[state=checked]:bg-red-600 enabled:data-[state=checked]:ring-0 enabled:data-[state=checked]:ring-transparent",
        "enabled:data-[state=indeterminate]:bg-red-600 enabled:data-[state=indeterminate]:ring-0 enabled:data-[state=indeterminate]:ring-transparent",
        focusRing,
        className,
      )}
      tremor-id="tremor-raw"
    >
      <CheckboxPrimitives.Indicator
        asChild
        className="flex size-full items-center justify-center"
      >
        {/* Minus Icon for checked/indeterminate */}
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="4"
            y1="8"
            x2="12"
            y2="8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </CheckboxPrimitives.Indicator>
    </CheckboxPrimitives.Root>
  )
})

CheckboxRemove.displayName = "CheckboxRemove"

export { CheckboxRemove }
