"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, CreditCard, Banknote, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { updateInvoiceStatus } from "@/app/actions/invoices";

export function NewPaymentForm({ invoices }: { invoices: any[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        invoiceId: "",
        method: "CB",
        date: new Date().toISOString().split('T')[0],
    });

    const selectedInvoice = invoices.find(inv => inv.id === formData.invoiceId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateInvoiceStatus(formData.invoiceId, "Payée");

        if (result.success) {
            router.push("/secretaire");
        } else {
            alert(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => router.back()} className="h-12 w-12 rounded-full hover:bg-white transition-all shadow-sm">
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Encaisser Paiement</h1>
                    <p className="text-gray-500 font-medium">Validation du règlement client.</p>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                {invoices.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Tout est à jour !</h3>
                        <p className="text-gray-500">Aucune facture en attente de paiement.</p>
                        <Button className="mt-6" onClick={() => router.push("/secretaire")}>Retour</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Facture à régler</label>
                            <div className="relative">
                                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <select
                                    name="invoiceId"
                                    value={formData.invoiceId}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-base font-semibold appearance-none"
                                >
                                    <option value="" disabled>Sélectionner une facture...</option>
                                    {invoices.map(inv => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.id} - {inv.intervention.client.name} ({inv.amount.toFixed(2)} €)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedInvoice && (
                            <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-700 font-bold">Montant dû</span>
                                    <span className="text-2xl font-black text-emerald-900">{selectedInvoice.amount.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-emerald-100 pt-4">
                                    <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Client</span>
                                    <span className="font-bold text-emerald-900">{selectedInvoice.intervention.client.name}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Mode</label>
                                <select name="method" value={formData.method} onChange={handleChange} className="w-full h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white px-4 font-semibold">
                                    <option value="CB">Carte Bancaire</option>
                                    <option value="Espèces">Espèces</option>
                                    <option value="Virement">Virement</option>
                                    <option value="Chèque">Chèque</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Date</label>
                                <Input name="date" type="date" value={formData.date} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50 border-gray-100" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button type="submit" disabled={isLoading || !formData.invoiceId} className="w-full h-16 rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-lg shadow-emerald-600/20">
                                {isLoading ? "Traitement..." : "Valider le Paiement"}
                            </Button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
