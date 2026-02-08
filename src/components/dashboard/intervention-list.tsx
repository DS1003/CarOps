"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Plus, User, Car,
    Calendar, CheckCircle2, Clock, AlertCircle, FileText,
    ArrowRight, Edit, Trash2, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function InterventionList({ initialInterventions }: { initialInterventions: any[] }) {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("Tous");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const tabs = ["Tous", "En attente", "En cours", "Terminé", "Facturée"];

    const filteredInterventions = initialInterventions.filter(int => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            int.client.name.toLowerCase().includes(query) ||
            int.vehicle.plate.toLowerCase().includes(query) ||
            int.vehicle.brand.toLowerCase().includes(query) ||
            int.vehicle.model.toLowerCase().includes(query) ||
            (int.customId && int.customId.toLowerCase().includes(query));
        const matchesTab = selectedTab === "Tous" || int.status === selectedTab;
        return matchesSearch && matchesTab;
    });

    const totalPages = Math.ceil(filteredInterventions.length / itemsPerPage);
    const paginatedInterventions = filteredInterventions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Terminé": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "En cours": return "bg-blue-50 text-blue-700 border-blue-100";
            case "En attente": return "bg-amber-50 text-amber-700 border-amber-100";
            case "Facturée": return "bg-purple-50 text-purple-700 border-purple-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                        RV <span className="text-primary">69</span> <span className="text-gray-400 not-italic lowercase">Atelier</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Gestion et suivi des interventions techniques en temps réel.</p>
                </div>
                <Button onClick={() => router.push("/reception/intervention/nouveau")} className="h-14 bg-gray-900 hover:bg-black text-white rounded-2xl gap-3 font-black px-8 transition-all hover:scale-[1.02] shadow-xl shadow-gray-200">
                    <Plus className="h-5 w-5" /> NOUVEAU DOSSIER
                </Button>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex p-1.5 bg-gray-100/50 rounded-2xl w-full xl:w-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setSelectedTab(tab);
                                setCurrentPage(1);
                            }}
                            className={`flex-1 xl:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${selectedTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            {selectedTab === tab && <motion.div layoutId="activeTabInter" className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100" />}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Rechercher un client, une plaque ou un dossier..."
                        className="pl-14 h-14 bg-gray-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-primary/5 focus:border-gray-200 transition-all w-full font-medium"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {paginatedInterventions.length > 0 ? (
                        paginatedInterventions.map((int, index) => (
                            <motion.div
                                key={int.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all p-8 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                                <div className="flex flex-col xl:flex-row xl:items-center gap-10 relative z-10">
                                    <div className="xl:w-44 shrink-0 xl:border-r xl:border-gray-100 xl:pr-8">
                                        <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">ID Dossier</div>
                                        <div className="text-xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">{int.customId || "RV-" + int.id.slice(0, 4).toUpperCase()}</div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(int.status)}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${int.status === 'Terminé' ? 'bg-emerald-500' : int.status === 'En cours' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                                            {int.status}
                                        </span>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <User className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Propriétaire</div>
                                                <div className="font-black text-gray-900 text-lg">{int.client.name}</div>
                                                <div className="text-xs text-gray-500 font-medium">{int.client.phone}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white scale-95 group-hover:scale-100 transition-transform">
                                                <Car className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Véhicule</div>
                                                <div className="font-black text-gray-900 text-lg uppercase italic">{int.vehicle.brand} {int.vehicle.model}</div>
                                                <div className="inline-block bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-md mt-1 tracking-widest">
                                                    {int.vehicle.plate}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="xl:w-56 shrink-0 border-l border-gray-100 pl-8 hidden lg:block">
                                        <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Nature Travaux</div>
                                        <div className="font-bold text-gray-900 mb-2">{int.type}</div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                                            <Calendar className="h-4 w-4 text-primary" /> {new Date(int.dateIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all"><Edit className="h-5 w-5" /></Button>
                                        <Button variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all"><Trash2 className="h-5 w-5" /></Button>
                                        <Button
                                            onClick={() => router.push(`/admin/intervention/${int.id}`)}
                                            className="h-12 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest ml-2 transition-all hover:translate-x-1"
                                        >
                                            PILOTER <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-[3rem] border border-dashed border-gray-200 p-20 text-center"
                        >
                            <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <Search className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun dossier trouvé</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">Ajustez vos filtres ou lancez une nouvelle recherche pour trouver l'intervention souhaitée.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-10">
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        variant="outline"
                        className="h-12 rounded-xl border-gray-100 font-bold uppercase text-[10px] tracking-widest px-6"
                    >
                        Précédent
                    </Button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/20 border-primary' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        variant="outline"
                        className="h-12 rounded-xl border-gray-100 font-bold uppercase text-[10px] tracking-widest px-6"
                    >
                        Suivant
                    </Button>
                </div>
            )}
        </div>
    );
}
