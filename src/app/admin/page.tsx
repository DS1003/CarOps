import { getDashboardStats } from "@/app/actions/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentInterventions } from "@/components/dashboard/recent-interventions";
import { BarChart } from "@/components/dashboard/bar-chart";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { Button } from "@/components/ui/button";
import { Download, Filter, Car, Users, Wrench, TrendingUp } from "lucide-react";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";

export default async function AdminDashboard() {
    const statsResult = await getDashboardStats();

    if (!statsResult.success) {
        return <div>Erreur de chargement des statistiques.</div>;
    }

    const { stats, recentInterventions, donutData, barChartData } = statsResult.data;

    const iconNameMap: Record<string, string> = {
        "Clients Actifs": "users",
        "Véhicules": "car",
        "Opérations Globales": "wrench",
        "Chiffre d'Affaires": "trending"
    };

    const colorMap: Record<string, string> = {
        "Clients Actifs": "text-blue-500",
        "Véhicules": "text-purple-500",
        "Opérations Globales": "text-amber-500",
        "Chiffre d'Affaires": "text-emerald-500"
    };

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans">
            <div className="p-6 space-y-8 max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Tableau de Bord</h1>
                        <p className="text-gray-500 font-medium">Vue d'ensemble des performances de votre garage.</p>
                    </div>
                    <DashboardActions data={{ stats, recentInterventions }} />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {stats.map((stat: any) => (
                        <StatCard
                            key={stat.label}
                            data={{
                                ...stat,
                                iconName: iconNameMap[stat.label],
                                color: colorMap[stat.label],
                                trendType: stat.trendType as 'up' | 'down'
                            }}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Revenus Mensuels</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">Flux d'activité hebdomadaire</p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <BarChart data={barChartData} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                        <div className="mb-8">
                            <h3 className="text-xl font-black text-gray-900">Répartition Services</h3>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">Par Type d'intervention</p>
                        </div>
                        <div className="h-[300px] flex items-center justify-center relative">
                            {donutData.length > 0 ? (
                                <DonutChart data={donutData} />
                            ) : (
                                <div className="text-gray-400 font-medium">Pas assez de données</div>
                            )}
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {donutData.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{item.name}</span>
                                        <span className="text-sm font-black text-gray-900">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <RecentInterventions interventions={recentInterventions} />
                </div>
            </div>
        </div>
    );
}
