"use client";

import { motion } from "framer-motion";
import { ChartDataItem } from "@/data/dashboard";

interface DonutChartProps {
    data: ChartDataItem[];
}

export function DonutChart({ data }: DonutChartProps) {
    let currentAngle = 0;
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    const segments = data.map(item => {
        const percentage = (item.value / total) * 100;
        const start = currentAngle;
        const end = currentAngle + percentage;
        currentAngle = end;
        return { ...item, start, end };
    });

    const gradient = segments.map(s => `${s.color} ${s.start}% ${s.end}%`).join(", ");

    return (
        <div className="h-full">
            <div className="h-64 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: "backOut" }}
                    className="w-48 h-48 rounded-full relative shrink-0 transition-transform hover:scale-105 duration-500 shadow-xl shadow-gray-200/50 group"
                    style={{
                        background: `conic-gradient(${gradient})`
                    }}
                >
                    <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center border border-gray-50 shadow-inner">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-3xl font-bold text-gray-900"
                        >
                            {total}
                        </motion.span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total</span>
                    </div>
                </motion.div>

                <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
                    {data.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + (i * 0.1) }}
                            className="flex items-center gap-2.5 group cursor-default"
                        >
                            <div
                                className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-gray-900 transition-colors">
                                {item.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
