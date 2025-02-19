import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";

const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
};

const SheetTrigger = ({ children, className, ...props }) => (
  <Dialog.Trigger asChild>
    <button
      className={cn(
        "fixed top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 z-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  </Dialog.Trigger>
);

const SheetContent = React.forwardRef(({ children, className, side = "right" }, ref) => {
  return (
    <Dialog.Portal>
      {/* Clicking Outside the Sidebar Closes It */}
      <Dialog.Overlay className="fixed inset-0 bg-black/40 transition-opacity" />
      
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed top-0 bottom-0 w-72 bg-white shadow-lg transform transition-transform duration-300",
          side === "right" ? "right-0 translate-x-0" : "left-0 -translate-x-full",
          "p-6 z-50"
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
});

SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetContent };
