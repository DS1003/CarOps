"use client";

import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, Eye, Edit, Trash2, MoreHorizontal, Car, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export interface RecentInterventionData {
    id: string;
    customId: string;
    client: string;
    vehicle: string;
    status: string;
    date: string;
    cost: number;
}

interface RecentInterventionsProps {
    interventions: RecentInterventionData[];
}

export function RecentInterventions({ interventions }: RecentInterventionsProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("Tous");
    const tabs = ["Tous", "En cours", "Terminé", "Facturée"];
    const [selectAll, setSelectAll] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const filteredInterventions = interventions.filter(int => {
        const matchesSearch =
            int.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            int.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            int.customId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = selectedTab === "Tous" || int.status === selectedTab;

        return matchesSearch && matchesTab;
    });

    const getAvatarColor = (index: number) => {
        const colors = [
            "bg-blue-50 text-blue-600",
            "bg-purple-50 text-purple-600",
            "bg-emerald-50 text-emerald-600",
            "bg-amber-50 text-amber-600",
            "bg-rose-50 text-rose-600"
        ];
        return colors[index % colors.length];
    };

    const toggleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            setSelectedIds(filteredInterventions.map(i => i.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            'Terminé': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'En cours': 'bg-blue-50 text-blue-700 border-blue-100',
            'Facturée': 'bg-purple-50 text-purple-700 border-purple-100',
            'En attente': 'bg-amber-50 text-amber-700 border-amber-100',
            'default': 'bg-gray-50 text-gray-700 border-gray-100'
        };
        const dots = {
            'Terminé': 'bg-emerald-500',
            'En cours': 'bg-blue-500',
            'Facturée': 'bg-purple-500',
            'En attente': 'bg-amber-500',
            'default': 'bg-gray-400'
        };

        const key = (status in styles) ? status as keyof typeof styles : 'default';

        return (
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${styles[key]}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${dots[key]}`} />
                {status}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 lg:p-8 border-b border-gray-50">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Interventions récentes</h2>
                            <span className="text-[10px] text-red-600 font-black bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                {filteredInterventions.length} DOSSIERS
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-bold">Suivi en temps réel de l'atelier</p>
                    </div>
                    <Button onClick={() => router.push("/admin/intervention/nouveau")} className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg shadow-red-600/20 rounded-2xl h-14 px-8 transition-all hover:scale-[1.02] font-black group w-full xl:w-auto">
                        <Plus className="h-5 w-5" />
                        <span>Nouvelle intervention</span>
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="flex p-1.5 bg-gray-50/80 rounded-2xl w-full lg:w-fit overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap flex-1 lg:flex-none ${selectedTab === tab
                                    ? 'text-gray-900 bg-white shadow-sm ring-1 ring-gray-100'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4 flex-1 w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Recherche..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-14 h-14 bg-white border-gray-200 rounded-[1.25rem] focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all w-full font-bold text-gray-600"
                            />
                        </div>
                        <Button variant="outline" className="h-14 rounded-2xl border-gray-100 gap-3 font-black px-6 shrink-0 text-gray-500 hover:bg-gray-50">
                            <Filter className="h-5 w-5" /> <span className="hidden sm:inline uppercase text-[10px] tracking-widest">Filtres</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="pl-8 pr-4 py-4 text-left w-14">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                    className="rounded-lg border-gray-200 text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer align-middle"
                                />
                            </th>
                            <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client / Dossier</th>
                            <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Véhicule</th>
                            <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entrée</th>
                            <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Montant</th>
                            <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                            <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        <AnimatePresence>
                            {filteredInterventions.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                >
                                    <td className="pl-8 pr-4 py-4" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                            className="rounded-lg border-gray-200 text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-11 w-11 flex items-center justify-center rounded-2xl text-xs font-black ${getAvatarColor(index)} shadow-sm group-hover:scale-105 transition-transform`}>
                                                {item.client.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-900">{item.client}</div>
                                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.customId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-900 font-black">{item.vehicle}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-500 font-bold">{new Date(item.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-black text-gray-900 tracking-tight">{item.cost.toLocaleString()} €</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-2 md:group-hover:translate-x-0">
                                            <button
                                                onClick={() => router.push(`/admin/intervention/${item.id}`)}
                                                className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                title="Voir"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => router.push(`/admin/intervention/${item.id}`)}
                                                className="p-2.5 rounded-xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                                                title="Éditer"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="p-2.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all" title="Supprimer">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                <AnimatePresence>
                    {filteredInterventions.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 border-b border-gray-50 hover:bg-gray-50/30 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => toggleSelection(item.id)}
                                        className="rounded-lg border-gray-200 text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer"
                                    />
                                    <div className={`h-11 w-11 flex items-center justify-center rounded-2xl text-xs font-black ${getAvatarColor(index)} shadow-sm`}>
                                        {item.client.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-gray-900">{item.client}</div>
                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.customId}</div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 text-gray-300 hover:text-gray-600">
                                            <MoreHorizontal className="h-6 w-6" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl border-gray-100 shadow-2xl p-2 min-w-[160px] bg-white z-50">
                                        <DropdownMenuItem className="gap-3 font-bold p-3 rounded-xl cursor-pointer">
                                            <Eye className="h-4 w-4 text-gray-400" /> Voir détails
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-3 font-bold p-3 rounded-xl cursor-pointer">
                                            <Edit className="h-4 w-4 text-gray-400" /> Modifier
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-3 font-bold p-3 rounded-xl cursor-pointer text-rose-600 focus:text-rose-700">
                                            <Trash2 className="h-4 w-4" /> Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="pl-8 mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Car className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-black text-gray-700">{item.vehicle}</span>
                                    <span className="text-[10px] font-bold text-gray-200">•</span>
                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="pl-8 flex items-center justify-between">
                                <StatusBadge status={item.status} />
                                <span className="text-sm font-black text-gray-900">{item.cost.toLocaleString()} €</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-8 flex justify-center border-t border-gray-50 bg-gray-50/20 mt-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/admin/intervention")}
                    className="text-gray-400 hover:text-red-600 font-black text-[10px] uppercase tracking-[0.3em] gap-4 w-full sm:w-auto py-6"
                >
                    Voir tout l'historique <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
