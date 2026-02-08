"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";

import { createClient } from "@/app/actions/clients";

export default function NewClientPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await createClient(formData);

        if (result.success) {
            router.push("/reception");
        } else {
            alert(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="h-12 w-12 rounded-full hover:bg-white hover:shadow-md transition-all"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-black text-gray-900 tracking-tight"
                        >
                            Nouveau Client
                        </motion.h1>
                        <p className="text-gray-500 font-medium">Créer un nouveau dossier client.</p>
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-900/5 border border-gray-100 p-8 md:p-12 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Nom Complet</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="ex. Jean Dupont"
                                        required
                                        className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="jean.dupont@email.com"
                                        required
                                        className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="06 12 34 56 78"
                                        required
                                        className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Ville</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Paris"
                                        required
                                        className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Adresse</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="123 Avenue des Champs-Élysées"
                                        required
                                        className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="h-14 px-8 rounded-2xl text-gray-500 font-bold border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-base"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-14 px-8 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-base shadow-lg shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Enregistrement...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="h-5 w-5" />
                                        Enregistrer Client
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
