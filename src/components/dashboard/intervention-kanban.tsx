"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Play, Pause, CheckCircle } from "lucide-react";
import { updateIntervention } from "@/app/actions/interventions";
import { useRouter } from "next/navigation";

export function InterventionKanban({ initialInterventions }: { initialInterventions: any[] }) {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'done'>('all');

    const filteredInterventions = initialInterventions.filter(int => {
        if (filter === 'all') return int.status !== 'Facturée';
        if (filter === 'pending') return int.status === 'En attente';
        if (filter === 'active') return int.status === 'En cours';
        if (filter === 'done') return int.status === 'Terminé';
        return true;
    });

    const handleUpdateStatus = async (id: string, status: string) => {
        await updateIntervention(id, { status });
        router.refresh();
    };

    return (
        <div className="space-y-8">
            <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-100 w-fit">
                {[
                    { id: 'all', label: 'Tout voir' },
                    { id: 'pending', label: 'En attente' },
                    { id: 'active', label: 'En cours' },
                    { id: 'done', label: 'Terminé' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id as any)}
                        className={`px-6 py-3 rounded-lg text-sm font-bold transition-all relative ${filter === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {filter === tab.id && (
                            <motion.div layoutId="activeFilter" className="absolute inset-0 bg-gray-100 rounded-lg -z-10" />
                        )}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredInterventions.map((intervention) => {
                        const isPending = intervention.status === 'En attente';
                        const isActive = intervention.status === 'En cours';
                        const isDone = intervention.status === 'Terminé';

                        return (
                            <motion.div
                                key={intervention.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`relative p-6 rounded-[2rem] border transition-all hover:shadow-xl flex flex-col justify-between min-h-[300px] bg-white 
                                    ${isActive ? 'border-primary/20 shadow-primary/5' : isDone ? 'border-green-100 opacity-60 hover:opacity-100' : 'border-gray-100'}`}
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-primary/5 text-primary' : 'bg-gray-50 text-gray-500'}`}>
                                            <Car className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                                {intervention.vehicle.brand} {intervention.vehicle.model}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{intervention.vehicle.plate}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                                            {intervention.type}
                                        </span>
                                        <p className="text-sm font-medium text-gray-600 leading-relaxed">{intervention.symptoms}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    {isPending && (
                                        <Button className="w-full bg-primary font-bold h-12 rounded-xl" onClick={() => handleUpdateStatus(intervention.id, 'En cours')}>
                                            <Play className="h-4 w-4 mr-2" /> Commencer
                                        </Button>
                                    )}
                                    {isActive && (
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 font-bold h-12 rounded-xl" onClick={() => handleUpdateStatus(intervention.id, 'En attente')}>
                                                <Pause className="h-4 w-4 mr-2" /> Pause
                                            </Button>
                                            <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold h-12 rounded-xl" onClick={() => handleUpdateStatus(intervention.id, 'Terminé')}>
                                                <CheckCircle className="h-4 w-4 mr-2" /> Finir
                                            </Button>
                                        </div>
                                    )}
                                    {isDone && (
                                        <div className="text-center w-full py-3 bg-green-50 rounded-xl text-sm font-bold text-green-600 flex items-center justify-center gap-2">
                                            <CheckCircle className="h-4 w-4" /> Prêt pour facturation
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
