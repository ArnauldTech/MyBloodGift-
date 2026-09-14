import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "bg-linear-to-r from-red-500 to-red-700 text-white hover:from-red-400 hover:to-red-800 cursor-pointer",
        secondary:
          "bg-linear-to-r from-blue-500 to-blue-700 text-white hover:from-blue-400 hover:to-blue-800",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs",
        sm: "h-7 gap-1 rounded-lg px-2.5 text-[0.8rem]",
        lg: "h-9 gap-1.5 px-6",
        icon: "size-8",
        "icon-xs": "size-6 rounded-lg",
        "icon-sm": "size-7 rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)
