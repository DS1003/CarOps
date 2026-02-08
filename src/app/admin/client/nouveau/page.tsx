"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Save, User, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function NouveauClientPage() {
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.back();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/client">
                    <Button variant="outline" size="icon" className="rounded-xl border-gray-200">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nouveau Client</h1>
                    <p className="text-muted-foreground font-medium">Enregistrer un nouveau propriétaire dans la base de données.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="rounded-[2.5rem] border-gray-100 shadow-xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-50 p-8">
                        <CardTitle className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                            <User className="h-5 w-5 text-red-500" /> Identité du Client
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nom Complet</label>
                            <Input placeholder="M. Jean Dupont" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Type de Client</label>
                            <select className="flex h-14 w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20">
                                <option>Particulier</option>
                                <option>Professionnel / Flotte</option>
                                <option>Administration</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input type="email" placeholder="client@email.com" className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input placeholder="06 .. .. .. .." className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" required />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Adresse de Résidence</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input placeholder="N°, Rue, CP, Ville" className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/client">
                        <Button variant="ghost" type="button" className="h-14 px-8 rounded-2xl font-bold text-gray-400 hover:text-gray-900">Annuler</Button>
                    </Link>
                    <Button type="submit" className="h-14 px-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-xl shadow-red-500/20 gap-3">
                        <Save className="h-5 w-5" /> Enregistrer le Client
                    </Button>
                </div>
            </form>
        </div>
    );
}
