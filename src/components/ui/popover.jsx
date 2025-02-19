import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

// Utility function for classNames handling
const classNames = (...classes) => classes.filter(Boolean).join(" ");

// Define components
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef(
  ({ className, align = "start", sideOffset = 4, usePortal = true, ...props }, ref) => {
    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={classNames(
          "z-50 rounded-md border bg-white text-gray-900 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
          className
        )}
        {...props}
      />
    );

    return usePortal ? <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal> : content;
  }
);

PopoverContent.displayName = "PopoverContent";

/** ✅ Wrapper for quick usage */
function PopoverWrapper({ trigger, children, usePortal = true }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent usePortal={usePortal}>{children}</PopoverContent>
    </Popover>
  );
}

// ✅ Export as named exports (NO default export)
export { Popover, PopoverTrigger, PopoverContent, PopoverWrapper };
