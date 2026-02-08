"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client } from "@/types";
import { User, Mail, Phone, MapPin, Building } from "lucide-react";

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Partial<Client>) => void;
    client?: Client | null;
}

export function ClientModal({ isOpen, onClose, onSave, client }: ClientModalProps) {
    const [formData, setFormData] = useState<Partial<Client>>({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
    });

    useEffect(() => {
        if (client) {
            setFormData(client);
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
                city: "",
            });
        }
    }, [client, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={client ? "Modifier le client" : "Nouveau client"}
            description={client ? "Mise à jour du dossier client." : "Enregistrement d'un nouveau client dans RV 69."}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Identité</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            required
                            placeholder="Nom complet"
                            className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Contact Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                type="email"
                                placeholder="Email"
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Téléphone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                placeholder="06..."
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Adresse de résidence</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Rue, Appt..."
                            className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Ville</label>
                    <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Ville"
                            className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                            value={formData.city || ""}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-10">
                    <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        Annuler
                    </Button>
                    <Button type="submit" className="h-12 px-10 rounded-xl bg-primary text-white shadow-xl shadow-primary/10 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {client ? "Enregistrer" : "Confirmer"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
