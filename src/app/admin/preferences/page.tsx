"use client";

import { motion } from "framer-motion";
import { Settings, Globe, Shield, CreditCard, Bell, Database, Palette, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function PreferencesPage() {
    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-10">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Paramètres</h1>
                <p className="text-gray-500 font-medium">Configurez le fonctionnement global de la plateforme.</p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-4 gap-10"
            >
                {/* Navigation Menu */}
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { label: "Général", icon: Settings, active: true },
                        { label: "Atelier", icon: Database, active: false },
                        { label: "Notifications", icon: Bell, active: false },
                        { label: "Paiements", icon: CreditCard, active: false },
                        { label: "Sécurité", icon: Shield, active: false },
                    ].map((nav) => (
                        <button
                            key={nav.label}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-bold text-sm ${nav.active
                                ? "bg-white text-primary shadow-md shadow-primary/5 border border-primary/10"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <nav.icon className="h-5 w-5" />
                            {nav.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-10">
                    <motion.div variants={item} className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-none">Configuration du Garage</h2>
                                <p className="text-xs text-gray-400 font-medium mt-1">Informations publiques affichées sur les factures et le site.</p>
                            </div>
                        </div>

                        <form className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Nom commercial l'établissement</label>
                                <Input defaultValue="RV 69 Premium Garage" className="h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-bold" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Numéro SIRET / ICE</label>
                                    <Input defaultValue="123 456 789 00010" className="h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">TVA Intracommunautaire</label>
                                    <Input defaultValue="FR 12 345678910" className="h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-medium" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Devise du système</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <select className="w-full pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all font-bold appearance-none outline-none text-sm">
                                        <option>Euro (€)</option>
                                        <option>Dollar ($)</option>
                                        <option>Dirham (MAD)</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div variants={item} className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Palette className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-none">Personnalisation du Thème</h2>
                                <p className="text-xs text-gray-400 font-medium mt-1">Adaptez l'interface à l'identité visuelle de votre marque.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { color: 'bg-primary', label: 'RV 69 Red', active: true },
                                { color: 'bg-blue-600', label: 'Ocean Blue', active: false },
                                { color: 'bg-emerald-600', label: 'Forest Green', active: false },
                                { color: 'bg-indigo-600', label: 'Dark Indigo', active: false },
                            ].map((theme) => (
                                <button key={theme.label} className={`group p-4 rounded-2xl border transition-all ${theme.active ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <div className={`h-8 w-8 rounded-lg ${theme.color} mb-3 shadow-md mx-auto group-hover:scale-110 transition-transform`} />
                                    <div className={`text-[9px] font-black uppercase tracking-widest text-center ${theme.active ? 'text-primary' : 'text-gray-400'}`}>{theme.label}</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="flex justify-end gap-3">
                        <Button variant="ghost" className="h-12 px-8 rounded-xl text-gray-400 font-bold uppercase text-[10px] tracking-widest">Réinitialiser</Button>
                        <Button className="h-12 px-10 rounded-xl bg-gray-900 text-white font-bold transition-all shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98]">
                            Appliquer les changements
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
