import { InventoryProduct, InventoryService } from "@/types";

export const produits: InventoryProduct[] = [
    { id: "1", ref: "HUILE-5W30", name: "Huile Moteur 5W30", category: "Lubrifiants", stock: 45, price: "12.50 €" },
    { id: "2", ref: "PNEU-MICH-205", name: "Michelin Primacy 4 205/55 R16", category: "Pneumatiques", stock: 8, price: "95.00 €" },
    { id: "3", ref: "FILTRE-H-01", name: "Filtre à Huile Bosche", category: "Filtres", stock: 24, price: "8.90 €" },
    { id: "4", ref: "LAVE-GLACE", name: "Liquide Lave-glace 5L", category: "Liquides", stock: 120, price: "4.50 €" },
];

export const services: InventoryService[] = [
    { id: "1", name: "Vidange Standard", category: "Entretien", duration: "1h", price: "59.00 €" },
    { id: "2", name: "Montage Pneu", category: "Pneumatiques", duration: "0.5h", price: "15.00 €" },
    { id: "3", name: "Diagnostic Valise", category: "Diagnostic", duration: "1h", price: "45.00 €" },
];
