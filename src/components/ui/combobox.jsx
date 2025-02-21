import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronDown } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function Combobox({
  label,
  options,
  value,
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(""); // ✅ Controlled search input
  const triggerRef = useRef(null);
  const [triggerWidth, setTriggerWidth] = useState(null);
  const comboboxRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1); // ✅ Keyboard navigation

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Filter options dynamically based on query
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  // ✅ Keyboard Navigation Handler
  const handleKeyDown = useCallback(
    (e) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      }
      if (e.key === "Enter" && activeIndex !== -1) {
        e.preventDefault();
        const selectedValue = filteredOptions[activeIndex]?.value || "";
        onChange(selectedValue);
        setQuery("");
        setOpen(false);
        setActiveIndex(-1);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
      }
    },
    [filteredOptions, activeIndex, open, onChange]
  );

  return (
    <Popover open={!disabled && open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className={`relative w-full h-[40px] px-3 flex items-center justify-between
            border ${
              disabled
                ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                : "border-gray-300 bg-white"
            }
            rounded-md transition-all cursor-text
            ${
              disabled
                ? ""
                : "focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
            }`}
          onClick={() => !disabled && setOpen(true)}
        >
          <span className={`text-sm ${value ? "text-black" : "text-gray-500"}`}>
            {value ? options.find((opt) => opt.value === value)?.label : label}
          </span>
          {value && !disabled ? (
            <X
              className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setQuery("");
                setOpen(false);
              }}
            />
          ) : (
            <ChevronDown
              className={`h-4 w-4 ${
                disabled ? "text-gray-300" : "text-gray-500"
              }`}
            />
          )}
        </div>
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent
          ref={comboboxRef}
          side="bottom"
          align="start"
          avoidCollisions={false}
          className="p-0 mt-1 shadow-md border border-gray-300 rounded-md bg-white max-h-[250px] overflow-y-auto z-50 w-full"
          style={{
            width: triggerWidth || "100%",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
          onKeyDown={handleKeyDown}
        >
          <Command shouldFilter={false}>
            <CommandInput
              className="border-b p-2 text-sm focus:outline-none focus:border-blue-500 text-black w-full"
              placeholder="Search..."
              value={query} // ✅ Controlled input
              onValueChange={(val) => setQuery(val || "")} // ✅ Fixing controlled state update
              autoFocus
            />
            {filteredOptions.length === 0 ? (
              <CommandEmpty className="p-2 text-sm text-gray-600">
                No options available
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((opt, index) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    className={`px-3 py-2 text-sm cursor-pointer text-black ${
                      index === activeIndex ? "bg-blue-100" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onSelect={() => {
                      onChange(opt.value);
                      setQuery("");
                      setOpen(false);
                      setActiveIndex(-1);
                    }}
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
