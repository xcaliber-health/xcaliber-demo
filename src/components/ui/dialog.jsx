import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
};

const DialogTrigger = ({ children, className, ...props }) => (
  <DialogPrimitive.Trigger asChild>
    <button className={cn("transition-all", className)} {...props}>
      {children}
    </button>
  </DialogPrimitive.Trigger>
);

const DialogContent = React.forwardRef(({ title, onClose, children, className, ...props }, ref) => {
  return (
    <DialogPrimitive.Portal>
      {/* Overlay (Clicking Outside Closes Modal) */}
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 transition-opacity" />

      {/* Dialog Box */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "w-full max-w-5xl h-[90vh] bg-white rounded-lg shadow-lg p-6 transition-transform",
            "animate-fadeIn scale-95",
            className
          )}
          {...props}
        >
         

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
});

DialogContent.displayName = "DialogContent";

export { Dialog, DialogTrigger, DialogContent };
