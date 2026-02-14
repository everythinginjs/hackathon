import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { FieldError as ReactHookFormFieldError } from "react-hook-form"

import { cn } from "../../lib/utils"
import { Label } from "./label"

const fieldVariants = cva("space-y-2", {
  variants: {
    orientation: {
      vertical: "flex flex-col",
      horizontal: "flex items-center gap-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof fieldVariants> & {
      "data-invalid"?: boolean
    }
>(({ className, orientation, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(fieldVariants({ orientation, className }))}
    {...props}
  />
))
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    errors?: Array<ReactHookFormFieldError | undefined>
  }
>(({ className, errors, children, ...props }, ref) => {
  const errorMessage = errors?.[0]?.message

  if (!errorMessage && !children) {
    return null
  }

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {errorMessage || children}
    </p>
  )
})
FieldError.displayName = "FieldError"

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
))
FieldGroup.displayName = "FieldGroup"

export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup }
