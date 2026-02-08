"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Car, CreditCard, Calendar, Palette, Gauge, User, ImagePlus, X } from "lucide-react";
import { motion } from "framer-motion";
import { createVehicle } from "@/app/actions/vehicles";

export function NewVehicleForm({ clients }: { clients: any[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        ownerId: "",
        brand: "",
        model: "",
        plate: "",
        year: "",
        type: "Berline",
        color: "",
        mileage: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, String((formData as any)[key]));
        });
        if (image) {
            data.append("image", image);
        }

        const result = await createVehicle(data);

        if (result.success) {
            router.push("/reception");
        } else {
            alert(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="h-12 w-12 rounded-full hover:bg-white hover:shadow-md transition-all"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nouveau Véhicule</h1>
                    <p className="text-gray-500 font-medium">Enregistrer un véhicule dans le parc.</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-900/5 border border-gray-100 p-8 md:p-12 overflow-hidden relative"
            >
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Photo du véhicule</label>
                        <div className="relative group">
                            {preview ? (
                                <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreview(null); setImage(null); }}
                                        className="absolute top-4 right-4 h-10 w-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors backdrop-blur-sm"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-gray-100 rounded-3xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group bg-gray-50/30">
                                    <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <ImagePlus className="h-8 w-8 text-gray-300 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-primary">Cliquez pour ajouter une photo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Propriétaire</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                            <select
                                name="ownerId"
                                value={formData.ownerId}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base font-semibold appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Sélectionner un client...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} - {client.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Marque</label>
                            <div className="relative">
                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="ex. Peugeot"
                                    required
                                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-base font-semibold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Modèle</label>
                            <div className="relative">
                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="ex. 3008"
                                    required
                                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-base font-semibold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Immatriculation</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    name="plate"
                                    value={formData.plate}
                                    onChange={handleChange}
                                    placeholder="AA-123-BB"
                                    required
                                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-base font-semibold uppercase font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Année</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    name="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={handleChange}
                                    placeholder="2023"
                                    required
                                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-base font-semibold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Couleur</label>
                            <div className="relative">
                                <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="ex. Blanc Nacré"
                                    required
                                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-base font-semibold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Kilométrage</label>
                            <div className="relative">
                                <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    name="mileage"
                                    type="number"
                                    value={formData.mileage}
                                    onChange={handleChange}
                                    placeholder="15000"
                                    required
                                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-base font-semibold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="h-14 px-8 rounded-2xl text-gray-500 font-bold border-gray-200 hover:bg-gray-50 text-base"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-14 px-8 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-base shadow-lg shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {isLoading ? "Enregistrement..." : "Enregistrer Véhicule"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
