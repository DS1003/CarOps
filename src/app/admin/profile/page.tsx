"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, Shield, Bell, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

export default function ProfilePage() {
    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-10">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Mon Profil</h1>
                <p className="text-gray-500 font-medium">Gérez vos informations personnelles et vos accès.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Quick Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full rounded-[2.5rem] bg-primary/5 flex items-center justify-center text-primary text-4xl font-bold shadow-inner">
                                JD
                            </div>
                            <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-400 hover:text-primary transition-all">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Administrateur</p>

                        <div className="mt-8 space-y-3">
                            <Button className="w-full h-11 rounded-xl bg-primary text-white font-bold transition-all shadow-lg shadow-primary/10">
                                Modifier l'avatar
                            </Button>
                            <Button variant="ghost" className="w-full h-11 rounded-xl text-gray-400 font-bold text-xs uppercase tracking-widest">
                                Supprimer
                            </Button>
                        </div>
                    </div>

                    <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                        <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">Sécurité du compte</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-bold">Double Auth</span>
                                <span className="text-emerald-600 font-bold">Activée</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-bold">Dernière Connexion</span>
                                <span className="text-gray-900 font-bold">Il y a 2h</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Detailed Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-8"
                >
                    <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">Informations Générales</h3>

                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Prénom</label>
                                    <Input defaultValue="John" className="h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Nom</label>
                                    <Input defaultValue="Doe" className="h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-medium" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Adresse Email professionnel</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input defaultValue="service@rv69.fr" className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input defaultValue="06 12 34 56 78" className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-medium" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Localisation</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input defaultValue="Casablanca, Maroc" className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-medium" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                                <Button className="h-12 px-10 rounded-xl bg-gray-900 text-white font-bold transition-all shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98]">
                                    Enregistrer les modifications
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Préférences Système</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Notifications Push</div>
                                        <div className="text-xs text-gray-400 font-medium">Recevoir les alertes d'interventions en temps réel</div>
                                    </div>
                                </div>
                                <div className="h-6 w-11 bg-primary rounded-full relative p-1 cursor-pointer">
                                    <div className="h-4 w-4 bg-white rounded-full absolute right-1" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-gray-50 pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Moon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Mode Sombre</div>
                                        <div className="text-xs text-gray-400 font-medium">Passer l'interface en thème nuit</div>
                                    </div>
                                </div>
                                <div className="h-6 w-11 bg-gray-200 rounded-full relative p-1 cursor-pointer">
                                    <div className="h-4 w-4 bg-white rounded-full absolute left-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
