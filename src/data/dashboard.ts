import {
    Users,
    Car,
    Wrench,
    TrendingUp,
} from "lucide-react";

export const adminStats = [
    { label: "Clients Actifs", value: "324", icon: Users, color: "text-blue-500", trend: "+12%" },
    { label: "Véhicules", value: "856", icon: Car, color: "text-purple-500", trend: "+5%" },
    { label: "Interventions", value: "1,240", icon: Wrench, color: "text-amber-500", trend: "+18%" },
    { label: "Chiffre d'Affaire", value: "52,450 €", icon: TrendingUp, color: "text-emerald-500", trend: "+7%" },
];

export const recentFiches = [
    { id: "INT-2024-001", client: "Jean Dupont", vehicle: "Peugeot 308", status: "Terminé", date: "Il y a 2h" },
    { id: "INT-2024-002", client: "Marie Martin", vehicle: "Renault Clio", status: "En cours", date: "Il y a 3h" },
    { id: "INT-2024-003", client: "Pierre Durand", vehicle: "VW Golf 7", status: "En attente", date: "Il y a 5h" },
    { id: "INT-2024-004", client: "Sophie Legrand", vehicle: "Citroën C3", status: "Facturée", date: "Hier" },
];

export interface ChartDataItem {
    name: string;
    value: number;
    color?: string;
}

export const barChartData: ChartDataItem[] = [
    { name: "Lundi", value: 12 },
    { name: "Mardi", value: 19 },
    { name: "Mercredi", value: 15 },
    { name: "Jeudi", value: 22 },
    { name: "Vendredi", value: 25 },
    { name: "Samedi", value: 18 },
    { name: "Dimanche", value: 10 },
];

export const donutChartData: ChartDataItem[] = [
    { name: "4 portes berline", value: 45, color: "#10b981" },
    { name: "SUV 4x4", value: 30, color: "#3b82f6" },
    { name: "Moto & Scooter", value: 15, color: "#7c3aed" },
    { name: "Poids lourds & Vans", value: 10, color: "#f59e0b" },
];
