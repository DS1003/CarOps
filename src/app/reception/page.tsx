import { getReceptionStats } from "@/app/actions/reception";
import { StatCard } from "@/components/dashboard/stat-card";
import {
    Plus, Search, Car, Clock,
    ChevronRight,
    Phone,
    Wrench,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function ReceptionDashboard() {
    const statsResult = await getReceptionStats();

    if (!statsResult.success) {
        return <div>Erreur de chargement.</div>;
    }

    const { stats, todayInterventions } = statsResult.data;

    const iconNameMap: Record<string, string> = {
        "Rendez-vous Jour": "clipboard",
        "Arrivées en attente": "car",
        "Véhicules en atelier": "wrench",
        "Prêts de véhicule": "car"
    };

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans">
            <div className="p-6 space-y-8 max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Accueil Réception</h1>
                        <p className="text-gray-500 font-medium">Gestion des entrées, sorties et rendez-vous du jour.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/reception/client/nouveau">
                            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/20 h-12 px-6 rounded-xl transition-all hover:scale-[1.02]">
                                <Plus className="h-5 w-5" /> Nouveau Client
                            </Button>
                        </Link>
                        <Link href="/reception/vehicule/nouveau">
                            <Button className="bg-gray-900 hover:bg-black text-white gap-2 shadow-lg shadow-gray-900/10 h-12 px-6 rounded-xl transition-all hover:scale-[1.02]">
                                <Car className="h-5 w-5" /> Entrée Véhicule
                            </Button>
                        </Link>
                        <Link href="/reception/intervention/nouveau">
                            <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2 shadow-lg shadow-amber-500/20 h-12 px-6 rounded-xl transition-all hover:scale-[1.02]">
                                <Wrench className="h-5 w-5" /> Intervention
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {stats.map((stat: any) => (
                        <StatCard key={stat.label} data={{ ...stat, iconName: iconNameMap[stat.label] }} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900">Interventions du jour</h2>
                            <Button variant="ghost" className="text-primary font-bold text-sm gap-2">
                                Voir planning <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {todayInterventions.length === 0 ? (
                                <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 text-gray-400 font-medium">
                                    Aucune intervention prévue aujourd'hui.
                                </div>
                            ) : todayInterventions.map((int: any) => (
                                <div key={int.id} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Date</span>
                                        <span className="text-sm font-black text-gray-900">{new Date(int.dateIn).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-gray-900">{int.client.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${int.status === 'En cours' ? 'bg-blue-50 text-blue-600' :
                                                int.status === 'Terminé' ? 'bg-emerald-50 text-emerald-600' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>{int.type}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Car className="h-3.5 w-3.5 text-primary" />
                                                <span className="font-bold text-gray-700">{int.vehicle.brand} {int.vehicle.model}</span>
                                                <span className="text-xs bg-gray-50 px-1.5 rounded font-mono">{int.vehicle.plate}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5" />
                                                {int.client.phone}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-11 px-5 rounded-2xl border-gray-100 text-xs font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                                            Fiche
                                        </Button>
                                        <Button className="h-11 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/10">
                                            Valider Arrivée
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-gray-900">Véhicules de prêt</h2>
                        <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl shadow-gray-900/20 relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 h-32 w-32 bg-white/5 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Car className="h-5 w-5 text-primary" /> Disponibles
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                                        <div>
                                            <div className="font-bold text-sm">Renault Clio IV</div>
                                            <div className="text-[10px] text-white/50 uppercase font-black">AA-999-ZZ</div>
                                        </div>
                                        <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">Libre</span>
                                    </div>
                                </div>
                                <Button className="w-full mt-6 bg-white text-gray-900 hover:bg-gray-100 font-black uppercase text-xs tracking-widest h-11 rounded-2xl transition-all">
                                    Gérer la flotte
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900 mb-4">Recherche rapide</h3>
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input placeholder="Client..." className="pl-10 h-10 bg-gray-50 border-none rounded-xl" />
                                </div>
                                <div className="relative">
                                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input placeholder="Immatriculation..." className="pl-10 h-10 bg-gray-50 border-none rounded-xl" />
                                </div>
                                <Button className="w-full bg-primary text-white h-11 rounded-xl font-bold">Rechercher</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
