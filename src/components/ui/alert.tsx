import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

// Enhanced AlertDescription that can handle multiple error messages
function AlertDescriptionList({
  className,
  error,
  children,
  ...props
}: React.ComponentProps<"div"> & { error?: string | string[] }) {
  // If error is provided, split it by newlines and render as list
  const renderErrorContent = () => {
    if (!error) return children;

    const errorMessages = Array.isArray(error) ? error : error.split('\n').filter(Boolean);

    if (errorMessages.length === 1) {
      return (
        <div
          data-slot="alert-description"
          className={cn(
            "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
            className
          )}
          {...props}
        >
          {errorMessages[0]}
        </div>
      );
    }

    return (
      <div
        data-slot="alert-description"
        className={cn(
          "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm",
          className
        )}
        {...props}
      >
        {errorMessages.map((message, index) => (
          <div key={index} className="flex items-start">
            <span className="text-destructive mr-1">•</span>
            <span className="leading-relaxed">{message}</span>
          </div>
        ))}
      </div>
    );
  };

  return renderErrorContent();
}

export { Alert, AlertTitle, AlertDescription, AlertDescriptionList }
