"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Users, Car, Wrench, TrendingUp, ClipboardList, Banknote, AlertTriangle, FileText } from "lucide-react";
import { Stat } from "@/types";

interface StatCardProps {
    data: Stat;
}

const ICON_MAP: Record<string, any> = {
    "users": Users,
    "car": Car,
    "wrench": Wrench,
    "trending": TrendingUp,
    "clipboard": ClipboardList,
    "banknote": Banknote,
    "alert": AlertTriangle,
    "file-text": FileText
};

export function StatCard({ data }: StatCardProps) {
    const isPositive = data.trend && data.trend.startsWith('+');
    const Icon = data.iconName ? (ICON_MAP[data.iconName] || TrendingUp) : (data.icon || TrendingUp);

    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm relative overflow-hidden h-full group transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/20"
        >
            <div className="flex items-center justify-between relative z-10 w-full">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{data.label}</p>
                    </div>

                    <div className="space-y-1">
                        <motion.p
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-3xl font-bold text-gray-900 tracking-tight"
                        >
                            {data.value}
                        </motion.p>

                        {data.trend && (
                            <div className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'} bg-gray-50 group-hover:bg-white px-2 py-0.5 rounded-lg w-fit transition-all`}>
                                {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                                <span className="text-[10px] font-black">{data.trend}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-primary/5 rounded-2xl p-4 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white duration-500 shadow-sm">
                        <Icon strokeWidth={2.5} className="h-7 w-7" />
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
        </motion.div>
    );
}
