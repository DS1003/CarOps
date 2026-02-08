import { DashboardInvoice } from "@/types";

export const factures: DashboardInvoice[] = [
    { id: "FAC-2024-001", client: "Jean Dupont", amount: "250.00 €", status: "Payée", date: "2024-03-10", due_date: "2024-04-10" },
    { id: "FAC-2024-002", client: "Sophie Legrand", amount: "320.00 €", status: "En attente", date: "2024-03-09", due_date: "2024-04-09" },
    { id: "FAC-2024-003", client: "Entreprise ABC", amount: "1,250.00 €", status: "Retard", date: "2024-02-15", due_date: "2024-03-15" },
];
