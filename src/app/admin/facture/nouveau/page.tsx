"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, FileText, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function NouvelleFacturePage() {
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.back();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/facture">
                    <Button variant="outline" size="icon" className="rounded-xl border-gray-200">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nouvelle Facture</h1>
                    <p className="text-muted-foreground">Générer une facture à partir d'une intervention ou manuellement.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-xl font-bold">Lignes de facturation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-4 items-end border-b pb-4 last:border-0">
                                <div className="flex-1 space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400">Désignation</label>
                                    <Input placeholder="Description des travaux" className="h-11 rounded-xl" />
                                </div>
                                <div className="w-20 space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400">Qté</label>
                                    <Input type="number" defaultValue="1" className="h-11 rounded-xl" />
                                </div>
                                <div className="w-32 space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-400">P.U (€)</label>
                                    <Input type="number" placeholder="0.00" className="h-11 rounded-xl" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-11 text-gray-300 hover:text-red-500"><Trash className="h-4 w-4" /></Button>
                            </div>
                            <Button variant="outline" className="w-full h-12 border-dashed rounded-xl gap-2 text-gray-500">
                                <Plus className="h-4 w-4" /> Ajouter une ligne
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 text-center">
                            <CardTitle className="text-sm font-bold uppercase text-gray-500">Récapitulatif</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Total HT</span>
                                <span className="font-bold">0.00 €</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">TVA (20%)</span>
                                <span className="font-bold">0.00 €</span>
                            </div>
                            <div className="pt-4 border-t flex justify-between items-end">
                                <span className="text-gray-900 font-bold uppercase">Total TTC</span>
                                <span className="text-3xl font-black text-primary">0.00 €</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-red-500/20 gap-3" onClick={handleSubmit}>
                        <FileText className="h-5 w-5" /> Générer la facture
                    </Button>
                </div>
            </div>
        </div>
    );
}
