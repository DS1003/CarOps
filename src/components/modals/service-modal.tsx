"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Service } from "@/types";
import { Wrench, Clock, DollarSign, Tag } from "lucide-react";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (service: Partial<Service>) => void;
    service?: Service | null;
}

export function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
    const [formData, setFormData] = useState<Partial<Service>>({
        name: "",
        category: "",
        price: 0,
        duration: "1h00",
    });

    useEffect(() => {
        if (service) {
            setFormData(service);
        } else {
            setFormData({
                name: "",
                category: "",
                price: 0,
                duration: "1h00",
            });
        }
    }, [service, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={service ? "Modifier la prestation" : "Nouvelle prestation"}
            description={service ? "Mise à jour du catalogue de services." : "Configurez une nouvelle offre forfaitaire."}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Type de service</label>
                    <div className="relative">
                        <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            required
                            placeholder="Libellé du service"
                            className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Catégorie technique</label>
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            required
                            placeholder="Entretien, Freinage..."
                            className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Forfait (€)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Temps de MO</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                placeholder="ex: 1h30"
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-10">
                    <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        Annuler
                    </Button>
                    <Button type="submit" className="h-12 px-10 rounded-xl bg-gray-900 text-white shadow-xl shadow-gray-200 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {service ? "Enregistrer" : "Confirmer l'offre"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
