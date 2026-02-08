"use client";

import {
    Search,
    Bell,
    ChevronDown,
    LogOut,
    User,
    Settings as SettingsIcon,
    Menu
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface HeaderProps {
    appName?: string;
    role?: string;
}

export function Header({ appName = "RV 69", role = "Administrateur" }: HeaderProps) {
    return (
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[40] h-16 transition-all duration-300">
            <div className="px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-gray-500 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="hidden lg:block">
                            <h1 className="text-sm font-semibold text-gray-500 tracking-tight uppercase italic font-black">
                                RV <span className="text-primary">69</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="hidden md:block relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Recherche rapide..."
                                className="pl-11 h-10 w-72 bg-gray-100/50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-primary/5 focus:border-gray-200 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 lg:gap-4">
                            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all relative group">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-white ring-1 ring-primary/10"></span>
                            </button>

                            <div className="relative group">
                                <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl px-2 py-1.5 hover:bg-gray-100/80 transition-all cursor-pointer border border-transparent hover:border-gray-200">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                            RV
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs font-black text-gray-900 leading-none uppercase italic">Admin RV 69</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">{role}</p>
                                    </div>
                                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                                </div>

                                {/* Dropdown UI */}
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-[100]">
                                    <div className="px-4 py-2 mb-1 border-b border-gray-50">
                                        <p className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider">Compte</p>
                                        <p className="text-xs font-bold text-gray-900 mt-1 truncate">contact@rv69.fr</p>
                                    </div>
                                    <Link href="/admin/profile">
                                        <button className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 gap-3 font-medium transition-all group/item">
                                            <div className="p-1.5 bg-gray-50 rounded-lg group-hover/item:bg-white"><User className="h-4 w-4" /></div>
                                            Mon Profil
                                        </button>
                                    </Link>
                                    <Link href="/admin/preferences">
                                        <button className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 gap-3 font-medium transition-all group/item">
                                            <div className="p-1.5 bg-gray-50 rounded-lg group-hover/item:bg-white"><SettingsIcon className="h-4 w-4" /></div>
                                            Réglages
                                        </button>
                                    </Link>
                                    <div className="my-1 border-t border-gray-50"></div>
                                    <button className="flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 gap-3 font-medium transition-all group/item">
                                        <div className="p-1.5 rounded-lg group-hover/item:bg-white"><LogOut className="h-4 w-4" /></div>
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
