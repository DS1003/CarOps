"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Package, AlertTriangle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/products";
import { useRouter } from "next/navigation";

export function ProductList({ initialProducts }: { initialProducts: any[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddMode, setIsAddMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "Fluides",
        price: 0,
        stock: 0,
        minStock: 5,
        unit: "Pièce"
    });

    const categories = ["Fluides", "Filtres", "Freinage", "Pneumatiques", "Éclairage", "Pièces Moteur", "Autre"];

    const filteredProducts = initialProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await createProduct(newProduct);
        if (result.success) {
            setIsAddMode(false);
            setNewProduct({ name: "", category: "Fluides", price: 0, stock: 0, minStock: 5, unit: "Pièce" });
            router.refresh();
        } else {
            alert(result.error);
        }
        setIsLoading(false);
    };

    const handleUpdateStock = async (id: string, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        await updateProduct(id, { stock: newStock });
        router.refresh();
    };

    return (
        <div className="space-y-8 max-w-[1920px] mx-auto p-6 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Gestion Stock</h1>
                    <p className="text-gray-500 font-medium">Catalogue de pièces et suivi des stocks.</p>
                </div>
                <Button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/20 h-12 px-6 rounded-xl transition-all"
                >
                    <Plus className="h-5 w-5" /> Nouveau Produit
                </Button>
            </div>

            {isAddMode && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100"
                >
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                        <div className="lg:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Nom</label>
                            <Input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Ex: Huile 5W30" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Catégorie</label>
                            <select
                                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm"
                                value={newProduct.category}
                                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Prix (€)</label>
                            <Input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Stock Initial</label>
                            <Input required type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} />
                        </div>
                        <Button type="submit" disabled={isLoading} className="h-10 bg-gray-900 rounded-xl">
                            {isLoading ? "..." : "Enregistrer"}
                        </Button>
                    </form>
                </motion.div>
            )}

            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Rechercher par nom, catégorie..."
                    className="border-none bg-transparent focus-visible:ring-0 p-0 h-auto"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    {product.stock <= product.minStock && (
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100">
                                            <AlertTriangle className="h-3 w-3" />
                                            <span className="text-[10px] font-extrabold uppercase tracking-wide">Stock bas</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{product.name}</h3>
                                <p className="text-sm font-medium text-gray-500">{product.category}</p>

                                <div className="mt-6 flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-gray-900">{product.price.toFixed(2)}</span>
                                    <span className="text-sm font-bold text-gray-400">€ / {product.unit}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">En Stock</span>
                                    <span className={`text-lg font-black ${product.stock <= product.minStock ? 'text-red-500' : 'text-gray-900'}`}>
                                        {product.stock}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 rounded-xl h-9 hover:bg-gray-50 text-xs font-bold"
                                        onClick={() => handleUpdateStock(product.id, product.stock, -1)}
                                    >
                                        -
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 rounded-xl h-9 hover:bg-gray-50 text-xs font-bold"
                                        onClick={() => handleUpdateStock(product.id, product.stock, 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
