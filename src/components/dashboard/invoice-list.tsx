"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, FileText, Download,
    ArrowUpRight, Printer, Mail, TrendingUp, Wallet, Clock, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function InvoiceList({ initialInvoices, isAdmin = true }: { initialInvoices: any[], isAdmin?: boolean }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInvoices = initialInvoices.filter(inv => {
        const clientName = inv.intervention.client.name;
        return inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clientName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Payée": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "En attente": return "bg-amber-50 text-amber-700 border-amber-100";
            case "En retard": return "bg-rose-50 text-rose-700 border-rose-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const stats = [
        { label: "Total Facturé", value: `${initialInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString()} €`, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
        { label: "Encaissé", value: `${initialInvoices.filter(i => i.status === "Payée").reduce((s, i) => s + i.amount, 0).toLocaleString()} €`, icon: Wallet, color: "bg-emerald-50 text-emerald-600" },
        { label: "En Attente", value: `${initialInvoices.filter(i => i.status === "En attente").reduce((s, i) => s + i.amount, 0).toLocaleString()} €`, icon: Clock, color: "bg-amber-50 text-amber-600" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Facturation</h1>
                    <p className="text-gray-500 font-medium">Suivez vos flux de trésorerie et vos factures clients.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="h-12 px-6 rounded-xl hover:bg-gray-50 font-bold gap-2">
                        <Download className="h-4 w-4" /> CSV
                    </Button>
                    <Button onClick={() => router.push("/secretaire/facture/nouveau")} className="h-12 bg-primary text-white shadow-xl shadow-primary/10 rounded-xl gap-2 font-bold px-6">
                        <FileText className="h-4 w-4" /> Nouvelle Facture
                    </Button>
                </div>
            </div>

            {isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                            <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{stat.label}</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="N° facture ou client..."
                        className="pl-11 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Facture</th>
                            <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Client</th>
                            <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                            <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Montant</th>
                            <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Statut</th>
                            <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredInvoices.map((inv) => (
                            <tr key={inv.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5 font-bold text-gray-900">{inv.id}</td>
                                <td className="px-8 py-5 font-bold text-gray-900">{inv.intervention.client.name}</td>
                                <td className="px-8 py-5 text-xs text-gray-500 font-bold">{new Date(inv.date).toLocaleDateString()}</td>
                                <td className="px-8 py-5 text-lg font-bold text-gray-900">{inv.amount} €</td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-bold border uppercase tracking-widest ${getStatusStyle(inv.status)}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><Printer className="h-4 w-4" /></Button>
                                        <Button className="h-9 px-4 rounded-xl bg-gray-900 text-white text-[9px] font-bold uppercase ml-2">Détails</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
