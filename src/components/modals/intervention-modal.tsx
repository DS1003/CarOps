"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Intervention } from "@/types";
import { Wrench, Calendar, DollarSign, Activity, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface InterventionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (intervention: Partial<Intervention>) => void;
    intervention?: Intervention | null;
}

export function InterventionModal({ isOpen, onClose, onSave, intervention }: InterventionModalProps) {
    const [formData, setFormData] = useState<Partial<Intervention>>({
        type: "",
        status: "En attente",
        dateIn: new Date().toISOString().split('T')[0],
        symptoms: "",
        cost: 0,
    });

    useEffect(() => {
        if (intervention) {
            setFormData({
                ...intervention,
                dateIn: new Date(intervention.dateIn).toISOString().split('T')[0]
            });
        } else {
            setFormData({
                type: "",
                status: "En attente",
                dateIn: intervention.dateIn ? new Date(intervention.dateIn).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                symptoms: "",
                cost: 0,
            });
        }
    }, [intervention, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const statuses = [
        { label: 'En attente', icon: AlertCircle, color: 'hover:bg-amber-50 hover:text-amber-600', active: 'bg-amber-500 text-white shadow-amber-200' },
        { label: 'En cours', icon: Clock, color: 'hover:bg-blue-50 hover:text-blue-600', active: 'bg-blue-500 text-white shadow-blue-200' },
        { label: 'Terminé', icon: CheckCircle2, color: 'hover:bg-emerald-50 hover:text-emerald-600', active: 'bg-emerald-500 text-white shadow-emerald-200' },
        { label: 'Facturée', icon: FileText, color: 'hover:bg-purple-50 hover:text-purple-600', active: 'bg-purple-600 text-white shadow-purple-200' },
    ];

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={intervention ? "Dossier Intervention" : "Ouverture de Dossier"}
            description={intervention ? "Suivi technique de l'intervention." : "Création d'un nouvel ordre de réparation."}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Prestation Principale</label>
                        <div className="relative">
                            <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                placeholder="Révision, Freins..."
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Date d'Entrée</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                type="date"
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.dateIn}
                                onChange={(e) => setFormData({ ...formData, dateIn: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Observations / Symptômes</label>
                    <div className="relative">
                        <Activity className="absolute left-4 top-4 text-gray-400 h-4 w-4" />
                        <textarea
                            required
                            placeholder="Détaillez la demande du client..."
                            className="w-full pl-12 p-4 min-h-[100px] bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 focus:shadow-sm outline-none transition-all text-sm font-medium resize-none"
                            value={formData.symptoms}
                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Statut du Dossier</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {statuses.map((s) => (
                            <button
                                key={s.label}
                                type="button"
                                onClick={() => setFormData({ ...formData, status: s.label as any })}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border border-transparent transition-all gap-2 ${formData.status === s.label
                                    ? `${s.active} shadow-lg scale-[1.02]`
                                    : `bg-gray-50/50 text-gray-400 ${s.color} hover:border-gray-100`
                                    }`}
                            >
                                <s.icon className={`h-4 w-4 ${formData.status === s.label ? 'text-white' : ''}`} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Montant Estimé (€)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium font-mono"
                            value={formData.cost}
                            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-10">
                    <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        Annuler
                    </Button>
                    <Button type="submit" className="h-12 px-10 rounded-xl bg-gray-900 text-white shadow-xl shadow-gray-200 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {intervention ? "Sauvegarder" : "Ouvrir l'OR"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
