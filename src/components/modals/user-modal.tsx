"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppUser } from "@/types";
import { User, Mail, Shield, ToggleLeft } from "lucide-react";
import { motion } from "framer-motion";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Partial<AppUser>) => void;
    user?: AppUser | null;
}

export function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
    const [formData, setFormData] = useState<Partial<AppUser>>({
        name: "",
        email: "",
        role: "Mécano",
        active: true,
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                name: "",
                email: "",
                role: "Mécano",
                active: true,
            });
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={user ? "Modifier le membre" : "Ajouter un membre"}
            description={user ? "Mise à jour des accès et profil." : "Invitez un nouveau membre dans votre équipe."}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Nom complet</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            required
                            placeholder="Ex: David Garcia"
                            className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Email professionnel</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            required
                            type="email"
                            placeholder="user@rv69.fr"
                            className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Rôle / Poste</label>
                    <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                            className="w-full pl-12 h-12 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:border-primary outline-none transition-all appearance-none font-medium"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Réception">Réception</option>
                            <option value="Sécrétaire">Sécrétaire</option>
                            <option value="Mécano">Mécano</option>
                            <option value="Chef d'atelier">Chef d'atelier</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-[1.5rem] border border-gray-100">
                    <div className="flex flex-col">
                        <p className="text-xs font-bold text-gray-900">Compte actif</p>
                        <p className="text-[10px] text-gray-400 font-medium">Permettre l'accès à la plateforme</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, active: !formData.active })}
                        className={`w-11 h-6 rounded-full transition-all relative ${formData.active ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                        <motion.div
                            animate={{ x: formData.active ? 22 : 2 }}
                            className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                    </button>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl border-gray-100">
                        Annuler
                    </Button>
                    <Button type="submit" className="h-12 px-8 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 font-bold">
                        {user ? "Sauvegarder" : "Créer le profil"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
