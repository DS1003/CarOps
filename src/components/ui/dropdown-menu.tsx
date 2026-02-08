"use client";

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface DropdownMenuContextType {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
            <div ref={containerRef} className="relative inline-block text-left">
                {children}
            </div>
        </DropdownMenuContext.Provider>
    )
}

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
    const context = React.useContext(DropdownMenuContext)
    if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

    const handleClick = () => {
        context.setIsOpen(!context.isOpen)
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: handleClick,
            "aria-expanded": context.isOpen,
            className: cn((children.props as any).className, "cursor-pointer")
        })
    }

    return (
        <button onClick={handleClick} className="cursor-pointer">
            {children}
        </button>
    )
}

export function DropdownMenuContent({
    children,
    align = "center",
    className
}: {
    children: React.ReactNode
    align?: "start" | "center" | "end"
    className?: string
}) {
    const context = React.useContext(DropdownMenuContext)
    if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

    const alignmentClasses = {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0"
    }

    return (
        <AnimatePresence>
            {context.isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={cn(
                        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-100 bg-white p-1 shadow-md",
                        alignmentClasses[align],
                        className
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export function DropdownMenuItem({
    children,
    className,
    onClick
}: {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}) {
    const context = React.useContext(DropdownMenuContext)

    const handleClick = () => {
        if (onClick) onClick()
        context?.setIsOpen(false)
    }

    return (
        <div
            onClick={handleClick}
            className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors",
                className
            )}
        >
            {children}
        </div>
    )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
    return <div className={cn("-mx-1 my-1 h-px bg-gray-100", className)} />
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
            {children}
        </div>
    )
}
