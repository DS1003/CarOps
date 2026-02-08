"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { Package, Tag, DollarSign, Database, AlertCircle } from "lucide-react";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    product?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        minStock: 0,
        unit: "Pièce",
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: "",
                category: "",
                price: 0,
                stock: 0,
                minStock: 0,
                unit: "Pièce",
            });
        }
    }, [product, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={product ? "Modifier le produit" : "Ajouter un produit"}
            description={product ? "Mise à jour des informations de stock." : "Référencez une nouvelle pièce dans RV 69."}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Désignation</label>
                    <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            required
                            placeholder="Ex: Filtre à Huile Purflux"
                            className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Catégorie</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                required
                                placeholder="Fluides, Moteur..."
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Prix de vente (€)</label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Stock Actuel</label>
                        <div className="relative">
                            <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="number"
                                required
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Stock d'alerte</label>
                        <div className="relative">
                            <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="number"
                                required
                                className="pl-12 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Unité</label>
                        <Input
                            required
                            placeholder="Pièce, Litre..."
                            className="h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all text-sm font-medium"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-10">
                    <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        Annuler
                    </Button>
                    <Button type="submit" className="h-12 px-10 rounded-xl bg-gray-900 text-white shadow-xl shadow-gray-200 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {product ? "Mise à jour" : "Ajouter au stock"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
