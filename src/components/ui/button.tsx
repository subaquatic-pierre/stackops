import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:no-underline",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white dark:text-surface-0 shadow-[0_0_0_0_rgba(34,197,94,0)] hover:bg-accent-light hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:-translate-y-px",
        secondary:
          "bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-slate-700 dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.12] hover:-translate-y-px",
        ghost:
          "bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
        icon: "bg-transparent border-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-md justify-center",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-5 py-2.5",
        lg: "h-12 px-7 text-base",
        "icon-sm": "w-7 h-7 p-0",
        "icon-md": "w-8 h-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
