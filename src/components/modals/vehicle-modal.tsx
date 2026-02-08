"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vehicle } from "@/types";
import { Car, Hash, Calendar, Gauge, Palette, Building, ImagePlus, X } from "lucide-react";

interface VehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: FormData) => void;
    vehicle?: any | null;
}

export function VehicleModal({ isOpen, onClose, onSave, vehicle }: VehicleModalProps) {
    const [formData, setFormData] = useState<any>({
        brand: "",
        model: "",
        plate: "",
        year: new Date().getFullYear(),
        type: "Berline",
        color: "",
        mileage: 0,
        ownerId: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (vehicle) {
            setFormData(vehicle);
            setPreview(vehicle.imageUrl || null);
        } else {
            setFormData({
                brand: "",
                model: "",
                plate: "",
                year: new Date().getFullYear(),
                type: "Berline",
                color: "",
                mileage: 0,
                ownerId: "",
            });
            setPreview(null);
            setImage(null);
        }
    }, [vehicle, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, String(formData[key]));
        });
        if (image) {
            data.append("image", image);
        }
        onSave(data);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={vehicle ? "Modifier le véhicule" : "Nouveau véhicule"}
            description={vehicle ? "Mise à jour des données techniques." : "Référencez un nouveau véhicule dans l'atelier."}
        >
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                {/* Photo Upload */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Photo du véhicule</label>
                    <div className="relative group">
                        {preview ? (
                            <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-gray-100">
                                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setPreview(null); setImage(null); }}
                                    className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-gray-100 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                                <ImagePlus className="h-8 w-8 text-gray-300 group-hover:text-primary transition-colors" />
                                <span className="text-xs font-bold text-gray-400 mt-2 group-hover:text-primary">Cliquez pour ajouter une photo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Constructeur</label>
                        <div className="relative">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                placeholder="Marque"
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Modèle Precise</label>
                        <div className="relative">
                            <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                placeholder="Modèle"
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Immatriculation</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                placeholder="AA-123-BB"
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium font-mono uppercase"
                                value={formData.plate || ""}
                                onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Couleur</label>
                        <div className="relative">
                            <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                placeholder="Gris, Noir..."
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.color || ""}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            />
                        </div>
                    </div>
                    {!vehicle && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">ID Propriétaire</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    required
                                    placeholder="Copier l'ID du client"
                                    className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                    value={formData.ownerId}
                                    onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Type</label>
                        <select
                            className="w-full h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all text-sm font-medium px-4"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Berline">Berline</option>
                            <option value="SUV">SUV</option>
                            <option value="Utilitaire">Utilitaire</option>
                            <option value="Citadine">Citadine</option>
                            <option value="Coupe">Coupé</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Millésime</label>
                        <Input
                            type="number"
                            className="h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white transition-all text-sm font-medium"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Kilométrage</label>
                        <Input
                            type="number"
                            className="h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white transition-all text-sm font-medium"
                            value={formData.mileage}
                            onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-10 pb-4">
                    <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        Annuler
                    </Button>
                    <Button type="submit" className="h-12 px-10 rounded-xl bg-primary text-white shadow-xl shadow-primary/10 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {vehicle ? "Enregistrer" : "Confirmer"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
