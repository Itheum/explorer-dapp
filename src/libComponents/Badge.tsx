import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "libs/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-1.5 text-base font-semibold text-foreground  transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-slate-300/20 hover:bg-primary/80 hover:text-black",
        secondary: "bg-secondary hover:bg-secondary/80",
        destructive: "bg-destructive hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
