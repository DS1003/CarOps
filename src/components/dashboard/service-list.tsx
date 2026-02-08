"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit, Clock, Tag, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createService, updateService, deleteService } from "@/app/actions/services";
import { useRouter } from "next/navigation";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
};

export function ServiceList({ initialServices }: { initialServices: any[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddMode, setIsAddMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newService, setNewService] = useState({
        name: "",
        category: "Entretien",
        price: 0,
        duration: "1h00",
    });

    const categories = ["Entretien", "Mécanique", "Carrosserie", "Pneumatiques", "Diagnostic", "Lavage"];

    const filteredServices = initialServices.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await createService(newService);
        if (result.success) {
            setIsAddMode(false);
            setNewService({ name: "", category: "Entretien", price: 0, duration: "1h00" });
            router.refresh();
        } else {
            alert(result.error);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer ce service ?")) {
            await deleteService(id);
            router.refresh();
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Catalogue des Services</h1>
                    <p className="text-gray-500 font-medium mt-1">Gérez les prestations proposées par votre garage.</p>
                </div>
                <Button
                    onClick={() => setIsAddMode(true)}
                    className="h-12 bg-primary hover:bg-primary/90 shadow-sm rounded-xl gap-2 font-bold transition-all px-6"
                >
                    <Plus className="h-5 w-5" /> Nouveau Service
                </Button>
            </div>

            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Rechercher un service..."
                        className="pl-11 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isAddMode && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2rem] border-2 border-primary/10 shadow-xl shadow-primary/5"
                >
                    <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nom du service</label>
                            <Input
                                required
                                placeholder="ex. Vidange Huile"
                                className="h-12 rounded-xl"
                                value={newService.name}
                                onChange={e => setNewService({ ...newService, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                            <select
                                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-3 text-sm"
                                value={newService.category}
                                onChange={e => setNewService({ ...newService, category: e.target.value })}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Prix (€)</label>
                            <Input
                                type="number"
                                required
                                className="h-12 rounded-xl"
                                value={newService.price}
                                onChange={e => setNewService({ ...newService, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2 flex flex-col justify-end">
                            <div className="flex gap-2">
                                <Button type="submit" disabled={isLoading} className="flex-1 h-12 bg-primary rounded-xl font-bold">
                                    {isLoading ? "..." : "Ajouter"}
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setIsAddMode(false)} className="h-12 rounded-xl">
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            )}

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredServices.map((service) => (
                    <motion.div
                        key={service.id}
                        variants={item}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                                <Tag className="h-6 w-6" />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(service.id)}
                                className="text-gray-300 hover:text-rose-600 rounded-xl"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-6">{service.category}</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-gray-50 flex flex-col gap-1 text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-400">
                                    <Banknote className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Prix</span>
                                </div>
                                <span className="text-lg font-black text-gray-900">{service.price} €</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 flex flex-col gap-1 text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-400">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Durée</span>
                                </div>
                                <span className="text-lg font-black text-gray-900">{service.duration}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
