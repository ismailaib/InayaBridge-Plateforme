import React from "react"

interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> { }

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, ...props }: BadgeProps, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className="z-10 block w-fit rounded-lg border border-[#99e6d6]/20 bg-[#3b82f6]/50 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tighter sm:text-sm dark:border-[#3b82f6 ]/30 dark:bg-[#3b82f6]/20"
        {...props}
      >
        <span className="bg-gradient-to-b from-[#3b82f6] to-[#3b82f6] bg-clip-text text-transparent dark:from-[#99e6d6] dark:to-[#3b82f6]">
          {children}
        </span>
      </span>
    )
  },
)

Badge.displayName = "Badge"

export { Badge, type BadgeProps }

