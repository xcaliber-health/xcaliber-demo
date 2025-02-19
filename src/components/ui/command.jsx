import React from "react";
import * as CommandPrimitive from "cmdk";
import { cn } from "../../lib/utils";

const Command = React.forwardRef(({ className = "", ...props }, ref) => (
  <CommandPrimitive.Command
    ref={ref}
    shouldFilter={false} // ✅ Disabling internal filtering
    className={cn("flex flex-col rounded-md bg-white shadow-md p-2", className)}
    {...props}
  />
));

const CommandGroup = React.forwardRef(({ className = "", ...props }, ref) => (
  <CommandPrimitive.CommandGroup
    ref={ref}
    className={cn("p-2", className)}
    {...props}
  />
));

const CommandInput = React.forwardRef(({ className = "", value = "", onValueChange, ...props }, ref) => (
  <div className="p-2">
    <CommandPrimitive.CommandInput
      ref={ref}
      value={value} // ✅ Ensuring controlled input
      onValueChange={(val) => onValueChange(val || "")} // ✅ Fixing potential undefined issue
      className={cn(
        "w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  </div>
));

const CommandItem = React.forwardRef(({ className = "", ...props }, ref) => (
  <CommandPrimitive.CommandItem
    ref={ref}
    className={cn("flex items-center p-2 rounded-md hover:bg-blue-100 cursor-pointer", className)}
    {...props}
  />
));

const CommandList = React.forwardRef(({ className = "", ...props }, ref) => (
  <CommandPrimitive.CommandList
    ref={ref}
    className={cn("max-h-60 overflow-auto", className)}
    {...props}
  />
));

const CommandEmpty = React.forwardRef(({ className = "", ...props }, ref) => (
  <CommandPrimitive.CommandEmpty
    ref={ref}
    className={cn("p-2 text-center text-gray-500", className)}
    {...props}
  />
));

Command.displayName = "Command";
CommandGroup.displayName = "CommandGroup";
CommandInput.displayName = "CommandInput";
CommandItem.displayName = "CommandItem";
CommandList.displayName = "CommandList";
CommandEmpty.displayName = "CommandEmpty";

export { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty };
