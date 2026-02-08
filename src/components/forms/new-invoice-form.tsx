"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createInvoice } from "@/app/actions/invoices";

export function NewInvoiceForm({ interventions, products, services }: { interventions: any[], products: any[], services: any[] }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedInterventionId, setSelectedInterventionId] = useState("");
    const [items, setItems] = useState<{ type: 'product' | 'service', id: string, name: string, price: number, quantity: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const selectedIntervention = interventions.find((i: any) => i.id === selectedInterventionId);

    const handleAddItem = (type: 'product' | 'service', item: any) => {
        setItems([...items, {
            type,
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = async () => {
        if (!selectedIntervention) return;
        setIsLoading(true);

        const result = await createInvoice({
            interventionId: selectedIntervention.id,
            amount: calculateTotal(),
            status: "En attente",
        });

        if (result.success) {
            router.push("/secretaire");
        } else {
            alert(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    onClick={() => step === 1 ? router.back() : setStep(1)}
                    className="h-12 w-12 rounded-full hover:bg-white transition-all shadow-sm"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nouvelle Facture</h1>
                    <p className="text-gray-500 font-medium">
                        {step === 1 ? "Sélectionner une intervention terminée" : `Facturation pour ${selectedIntervention?.client.name}`}
                    </p>
                </div>
            </div>

            {step === 1 && (
                <div className="grid gap-4">
                    {interventions.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                            <FileText className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">Aucune intervention à facturer</h3>
                            <p className="text-gray-400">Toutes les interventions terminées ont été facturées.</p>
                        </div>
                    ) : (
                        interventions.map(int => (
                            <motion.div
                                key={int.id}
                                onClick={() => { setSelectedInterventionId(int.id); setStep(2); }}
                                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg cursor-pointer transition-all group flex justify-between items-center"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">{int.customId || int.id.slice(0, 8)}</span>
                                        <h3 className="text-lg font-black text-gray-900">{int.client.name}</h3>
                                    </div>
                                    <p className="text-gray-500 font-medium">{int.vehicle.brand} {int.vehicle.model} - {int.type}</p>
                                </div>
                                <ArrowLeft className="h-5 w-5 rotate-180 text-gray-300 group-hover:text-primary transition-colors" />
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {step === 2 && selectedIntervention && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                            <h3 className="font-black text-gray-900 text-lg mb-6">Éléments de facturation</h3>
                            <div className="space-y-4 min-h-[150px]">
                                {items.length === 0 && <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">Ajoutez des articles</div>}
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <div className="font-bold text-gray-900">{item.name}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-black">{item.type}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-gray-900">{item.price}€</span>
                                            <button onClick={() => handleRemoveItem(idx)} className="text-gray-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total HT</p>
                                    <p className="text-lg font-black text-gray-900 mt-1">Total TTC</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-500">{(calculateTotal() / 1.2).toFixed(2)}€</p>
                                    <p className="text-3xl font-black text-primary mt-1">{calculateTotal().toFixed(2)}€</p>
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleSubmit} disabled={isLoading || items.length === 0} className="w-full h-16 rounded-[2rem] text-xl font-black bg-gray-900 text-white shadow-xl shadow-gray-900/10">
                            {isLoading ? "Génération..." : "Confirmer Facturation"}
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
                            <h4 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-50">Services</h4>
                            <div className="space-y-1 max-h-[250px] overflow-y-auto">
                                {services.map(s => (
                                    <button key={s.id} onClick={() => handleAddItem('service', s)} className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium flex justify-between items-center group">
                                        <span className="text-gray-600 group-hover:text-gray-900">{s.name}</span>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{s.price}€</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
                            <h4 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-50">Produits</h4>
                            <div className="space-y-1 max-h-[250px] overflow-y-auto">
                                {products.map(p => (
                                    <button key={p.id} onClick={() => handleAddItem('product', p)} className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium flex justify-between items-center group">
                                        <div>
                                            <div className="text-gray-600 group-hover:text-gray-900">{p.name}</div>
                                            <div className="text-[10px] text-gray-300">Stock: {p.stock}</div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{p.price}€</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
