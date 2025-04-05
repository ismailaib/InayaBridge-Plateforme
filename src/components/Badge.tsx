import React from "react"

interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, ...props }: BadgeProps, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className="z-10 block w-fit rounded-lg border border-[#99e6d6]/20 bg-[#e6f9f5]/50 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tighter sm:text-sm dark:border-[#005f4d]/30 dark:bg-[#003c30]/20"
        {...props}
      >
        <span className="bg-gradient-to-b from-[#00b38f] to-[#009e7f] bg-clip-text text-transparent dark:from-[#99e6d6] dark:to-[#33ccad]">
          {children}
        </span>
      </span>
    )
  },
)

Badge.displayName = "Badge"

export { Badge, type BadgeProps }
