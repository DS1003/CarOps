"use client";

import { motion } from "framer-motion";
import { ChartDataItem } from "@/data/dashboard";
import { useState } from "react";

interface BarChartProps {
    data: ChartDataItem[];
}

export function BarChart({ data }: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Activité Financière</h3>
                    <p className="text-xs text-gray-400 font-medium mt-1">Évolution des revenus sur les derniers mois</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Revenus (€)</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[250px] relative flex items-end justify-between gap-2 sm:gap-4 px-2">
                {/* Y-Axis Lines (Background) */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                    {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                        <div key={tick} className="w-full border-t border-dashed border-gray-100 relative">
                            <span className="absolute -top-3 -left-0 text-[9px] text-gray-300 font-bold">
                                {Math.round(maxValue * (1 - tick))}
                            </span>
                        </div>
                    ))}
                </div>

                {data.map((item, i) => {
                    const heightPercent = (item.value / maxValue) * 100;
                    const isHovered = hoveredIndex === i;

                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-end flex-1 h-full z-10 relative group"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Tooltip */}
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? -10 : 10, scale: isHovered ? 1 : 0.9 }}
                                className="absolute bottom-full mb-2 z-20 pointer-events-none"
                            >
                                <div className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl flex flex-col items-center whitespace-nowrap">
                                    <span className="text-gray-400 text-[9px] uppercase tracking-wider mb-0.5">{item.name}</span>
                                    <span className="text-sm">{item.value.toLocaleString()} €</span>
                                    <div className="w-2 h-2 bg-gray-900 rotate-45 absolute -bottom-1"></div>
                                </div>
                            </motion.div>

                            {/* Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className={`w-full max-w-[40px] rounded-t-2xl relative overflow-hidden transition-all duration-300 ${isHovered ? 'bg-primary shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            </motion.div>

                            {/* Label */}
                            <span className={`text-[10px] font-bold uppercase mt-3 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-gray-400'
                                }`}>
                                {item.name.substring(0, 3)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
