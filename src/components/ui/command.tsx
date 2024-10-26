// components/ui/command.tsx
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils"; // Adjust this path based on where you store utility functions

export const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            "rounded-lg border shadow-md bg-white text-black",
            className
        )}
        {...props}
    />
));
Command.displayName = CommandPrimitive.displayName;

export const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Input
        ref={ref}
        className={cn(
            "border-b p-2 w-full outline-none",
            className
        )}
        {...props}
    />
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

export const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn(
            "max-h-60 overflow-auto",
            className
        )}
        {...props}
    />
));
CommandList.displayName = CommandPrimitive.List.displayName;

export const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "cursor-pointer p-2 hover:bg-gray-100",
            className
        )}
        {...props}
    />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "p-2",
            className
        )}
        {...props}
    />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

export const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className={cn(
            "p-2 text-center text-gray-500",
            className
        )}
        {...props}
    />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
