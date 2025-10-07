import type { Config } from "tailwindcss"

const cubicBezier = "150ms cubic-bezier(0.16, 1, 0.3, 1)"
const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ["NanumPenScript"],
      },
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        accordionOpen: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionClose: {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: { height: "0px" },
        },
        dialogOverlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        dialogContentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -45%) scale(0.95)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "dialog-overlay-show": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "dialog-content-show": {
          from: {
            opacity: "0",
            transform: "translate(-50%, -45%) scale(0.95)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "slide-down-and-fade": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left-and-fade": {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up-and-fade": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-right-and-fade": {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "drawer-slide-left-and-fade": {
          from: {
            opacity: "0",
            transform: "translateX(1.25rem)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "drawer-slide-right-and-fade": {
          from: {
            opacity: "1",
            transform: "translateX(0)",
          },
          to: {
            opacity: "0",
            transform: "translateX(1.25rem)",
          },
        },
        "slide-up-fade": {
          from: {
            opacity: "0",
            transform: "translateY(12px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        "slide-down-fade": {
          from: {
            opacity: "0",
            transform: "translateY(-26px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
      },
      animation: {
        hide: `hide ${cubicBezier}`,
        slideDownAndFade: `slideDownAndFade ${cubicBezier}`,
        slideLeftAndFade: `slideLeftAndFade ${cubicBezier}`,
        slideUpAndFade: `slideUpAndFade ${cubicBezier}`,
        slideRightAndFade: `slideRightAndFade ${cubicBezier}`,
        // Accordion
        accordionOpen: "accordionOpen 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        accordionClose: "accordionClose 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        // Dialog
        dialogOverlayShow: `dialogOverlayShow ${cubicBezier}`,
        dialogContentShow: `dialogContentShow ${cubicBezier}`,
        "dialog-overlay-show": `dialog-overlay-show ${cubicBezier}`,
        "dialog-content-show": `dialog-content-show ${cubicBezier}`,
        "slide-down-and-fade": `slide-down-and-fade ${cubicBezier}`,
        "slide-left-and-fade": `slide-left-and-fade ${cubicBezier}`,
        "slide-up-and-fade": `slide-up-and-fade ${cubicBezier}`,
        "slide-right-and-fade": `slide-right-and-fade ${cubicBezier}`,
        "drawer-slide-left-and-fade": "drawer-slide-left-and-fade 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "drawer-slide-right-and-fade": "drawer-slide-right-and-fade 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade ease-in-out",
        "slide-up-fade": "slide-up-fade ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
}
export default config
