"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Car,
    Wrench,
    TrendingUp,
    Clock,
    AlertCircle
} from "lucide-react";

export default function Dashboard() {
    const stats = [
        { label: "Clients Actifs", value: "248", icon: Users, color: "text-blue-500", trend: "+12%" },
        { label: "Véhicules", value: "842", icon: Car, color: "text-purple-500", trend: "+5%" },
        { label: "Interventions", value: "1,240", icon: Wrench, color: "text-amber-500", trend: "+18%" },
        { label: "Chiffre d'Affaire", value: "48,250 €", icon: TrendingUp, color: "text-emerald-500", trend: "+7%" },
    ];

    const recentInterventions = [
        { id: "INT-001", client: "Jean Dupont", vehicle: "Peugeot 308", status: "Terminé", date: "Il y a 2h" },
        { id: "INT-002", client: "Marie Martin", vehicle: "Renault Clio", status: "En cours", date: "Il y a 3h" },
        { id: "INT-003", client: "Pierre Durand", vehicle: "Volkswagen Golf", status: "En attente", date: "Il y a 5h" },
        { id: "INT-004", client: "Sophie Lefebvre", vehicle: "Citroën C3", status: "Terminé", date: "Hier" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bonjour, Admin</h1>
                <p className="text-muted-foreground">Voici un aperçu de l'activité de votre garage aujourd'hui.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-emerald-500 font-medium">{stat.trend}</span> par rapport au mois dernier
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Interventions Récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentInterventions.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.client}</p>
                                        <p className="text-sm text-muted-foreground">{item.vehicle} • {item.id}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status === 'Terminé' ? 'bg-emerald-100 text-emerald-700' :
                                            item.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{item.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Alertes & Rappels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-3 rounded-lg bg-amber-50">
                                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900">Stock de pneus bas</p>
                                    <p className="text-xs text-amber-700">Le stock de Michelin Primacy 4 est descendu à 5 unités.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-lg bg-red-50">
                                <Clock className="h-5 w-5 text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-900">4 contrôles techniques en retard</p>
                                    <p className="text-xs text-red-700">Veuillez contacter les clients concernés.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
