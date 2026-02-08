import { getSecretariatStats } from "@/app/actions/secretariat";
import { StatCard } from "@/components/dashboard/stat-card";
import {
    CheckCircle2, Printer, Mail, ArrowUpRight,
    TrendingUp, Plus, FileText, Banknote, AlertTriangle, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SecretaireDashboard() {
    const result = await getSecretariatStats();

    if (!result.success) {
        return <div>Erreur de chargement.</div>;
    }

    const { stats, pendingInvoices } = result.data;

    const iconNameMap: Record<string, string> = {
        "Clients Actifs": "users",
        "Factures Émises": "file-text",
        "Montant Encaissé": "banknote",
        "Alertes Stock": "alert"
    };

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans">
            <div className="p-6 space-y-8 max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Espace Secrétariat</h1>
                        <p className="text-gray-500 font-medium">Gestion administrative, facturation et encaissements.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/secretaire/facture/nouveau">
                            <Button className="bg-gray-900 hover:bg-black text-white gap-2 shadow-lg shadow-gray-900/10 h-12 px-6 rounded-xl transition-all hover:scale-[1.02]">
                                <Plus className="h-5 w-5" /> Nouvelle Facture
                            </Button>
                        </Link>
                        <Link href="/secretaire/paiement/nouveau">
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg shadow-emerald-500/20 h-12 px-6 rounded-xl transition-all hover:scale-[1.02]">
                                Encaisser Paiement
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {stats.map((stat: any) => (
                        <StatCard key={stat.label} data={{ ...stat, iconName: iconNameMap[stat.label] }} />
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900">Factures en attente de paiement</h2>
                            <Button variant="ghost" className="text-primary font-bold text-sm gap-2">
                                Voir tout <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            {pendingInvoices.length === 0 ? (
                                <div className="p-20 text-center text-gray-400 font-medium font-bold">Aucune facture en attente.</div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Client</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Montant</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {pendingInvoices.map((inv: any) => (
                                            <tr key={inv.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{inv.clientName}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{inv.id}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                    {new Date(inv.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-black text-gray-900">{inv.amount.toFixed(2)} €</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                                                            <Printer className="h-4 w-4" />
                                                        </Button>
                                                        <Link href={`/secretaire/paiement/nouveau?invoice=${inv.id}`}>
                                                            <Button className="h-9 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest transition-all">
                                                                Encaisser
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-gray-900">Activité récente</h2>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 leading-tight">Système à jour</div>
                                    <div className="text-xs text-gray-500">Données synchronisées avec la BDD</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl text-white shadow-xl shadow-gray-900/20">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" /> Objectif Mensuel
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/50">
                                    <span>Progression</span>
                                    <span>{Math.min(100, (Number(result.data.stats[2].value.replace('€', '').replace(',', '')) / 50000) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (Number(result.data.stats[2].value.replace('€', '').replace(',', '')) / 50000) * 100)}%` }}></div>
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed font-medium">
                                    Objectif: <span className="text-white font-bold">50,000 €</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
