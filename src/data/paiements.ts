import { Paiement } from "@/types";

export const paiements: Paiement[] = [
    {
        id: "PAY-2024-089",
        invoice_id: "FAC-2024-001",
        client: "Jean-Pierre Bernard",
        method: "Carte Bancaire",
        amount: "250.00 €",
        date: "2024-03-10"
    },
    {
        id: "PAY-2024-090",
        invoice_id: "FAC-2024-005",
        client: "Marie Lefebvre",
        method: "Espèces",
        amount: "50.00 €",
        date: "2024-03-11"
    },
];
