"use client";

import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar as CalendarIcon, FileText, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface DashboardActionsProps {
    data: {
        stats: any[];
        recentInterventions: any[];
    }
}

declare module "jspdf" {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

export function DashboardActions({ data }: DashboardActionsProps) {
    const [period, setPeriod] = useState("Ce mois");

    const periods = [
        "Aujourd'hui",
        "Cette semaine",
        "Ce mois",
        "Ce trimestre",
        "Cette année"
    ];

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(31, 41, 55); // Dark Gray
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("RV 69", 20, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("RAPPORT D'ACTIVITÉ AUTOMOBILE", 20, 32);

        doc.setTextColor(255, 255, 255);
        doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 150, 25);
        doc.text(`Période: ${period.toUpperCase()}`, 150, 32);

        // Stats Summary
        doc.setTextColor(31, 41, 55);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("RÉSUMÉ DES PERFORMANCES", 20, 55);

        let yPos = 65;
        data.stats.forEach((stat) => {
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(`${stat.label}:`, 20, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(stat.value, 80, yPos);
            yPos += 8;
        });

        // Table
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("INTERVENTIONS RÉCENTES", 20, yPos + 10);

        const tableColumn = ["ID", "Client", "Véhicule", "Date", "Montant", "Statut"];
        const tableRows = data.recentInterventions.map(int => [
            int.customId || int.id.slice(0, 8),
            int.client,
            int.vehicle,
            new Date(int.date).toLocaleDateString(),
            int.cost + " €",
            int.status
        ]);

        autoTable(doc, {
            startY: yPos + 15,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: 'bold' }, // Red theme for RV 69
            alternateRowStyles: { fillColor: [249, 250, 251] },
            margin: { left: 20, right: 20 },
            styles: { fontSize: 9, cellPadding: 4 }
        });

        doc.save(`Rapport_RV69_${period.replace(" ", "_")}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="flex gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 gap-2 border-gray-200 h-14 px-6 rounded-2xl transition-all font-bold shadow-sm">
                        <Filter className="h-4 w-4 text-primary" />
                        <span className="text-xs uppercase tracking-widest">Période: {period}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-gray-100 bg-white z-50">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-2">Période d'analyse</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-50" />
                    {periods.map((p) => (
                        <DropdownMenuItem
                            key={p}
                            onClick={() => setPeriod(p)}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer hover:bg-primary/5 group"
                        >
                            <span className={`text-sm font-bold ${period === p ? 'text-primary' : 'text-gray-600'}`}>{p}</span>
                            {period === p && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <Check className="h-4 w-4 text-primary" />
                                </motion.div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                onClick={handleExportPDF}
                className="bg-primary hover:bg-rose-600 text-white gap-3 shadow-xl shadow-rose-500/20 h-14 px-8 rounded-2xl transition-all hover:scale-[1.02] font-black uppercase tracking-widest text-xs"
            >
                <FileText className="h-5 w-5" /> EXPORTER PDF
            </Button>
        </div>
    );
}

// Add motion for the check icon
import { motion } from "framer-motion";
