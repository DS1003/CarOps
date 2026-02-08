"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wrench, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavSection } from "@/types";

interface SidebarProps {
    items: NavSection[];
    title?: string;
}

export function Sidebar({ items = [], title = "RV 69" }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        router.push("/auth/login");
    };

    return (
        <aside className="flex h-screen w-64 flex-col bg-white border-r border-gray-100/80 transition-all duration-300">
            <div className="h-16 flex items-center px-6">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                    <span className="text-xl font-black tracking-tight text-gray-900 italic uppercase">
                        RV <span className="text-primary">69</span>
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-hidden hover:overflow-y-auto px-4 py-6 scrollbar-hide">
                <nav className="space-y-6">
                    {items.map((section, i) => (
                        <div key={i} className="space-y-1">
                            <h3 className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                {section.title}
                            </h3>
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-primary/5 text-primary"
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <Icon className={cn(
                                                "h-4.5 w-4.5 transition-colors",
                                                isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-900"
                                            )} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="p-4 mt-auto">
                <div className="bg-gray-50/50 border border-gray-100/50 rounded-2xl p-3">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">RV</div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-gray-900 truncate uppercase italic">Admin RV 69</p>
                            <p className="text-[10px] text-gray-400">contact@rv69.fr</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-2.5 h-9 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 font-medium px-2 py-0 text-xs transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </Button>
                </div>
            </div>
        </aside>
    );
}
