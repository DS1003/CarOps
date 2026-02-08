import { DashboardIntervention } from "@/types";

export const interventions: DashboardIntervention[] = [
    { id: "INT-2024-001", client: "Jean Dupont", vehicle: "Peugeot 308", type: "Révision Complète", status: "Terminé", date: "2024-03-10", cost: "250 €" },
    { id: "INT-2024-002", client: "Marie Martin", vehicle: "Renault Clio", type: "Changement Pneus", status: "En cours", date: "2024-03-11", cost: "400 €" },
    { id: "INT-2024-003", client: "Pierre Durand", vehicle: "VW Golf 7", type: "Vidange", status: "En attente", date: "2024-03-12", cost: "90 €" },
    { id: "INT-2024-004", client: "Sophie Legrand", vehicle: "Citroën C3", type: "Freins AV/AR", status: "Facturée", date: "2024-03-09", cost: "320 €" },
    { id: "INT-2024-005", client: "Michel Bernard", vehicle: "BMW Série 3", type: "Diagnostic Élec", status: "Planifié", date: "2024-03-14", cost: "150 €" },
];
