import {
    Users, Car, Wrench, TrendingUp, AlertTriangle,
    CheckCircle2, Clock, FileText, Banknote
} from "lucide-react";
import { Client, Vehicle, Intervention, Invoice, Product, Service, Stat } from "@/types";

export const CLIENTS: Client[] = [
    { id: 1, name: "Jean-Pierre Bernard", email: "jp.bernard@email.fr", phone: "06 12 34 56 78", address: "12 Rue de la Paix, 75002 Paris", joined: "15/05/2023", city: "Paris" },
    { id: 2, name: "Marie-Louise Dubois", email: "ml.dubois@gmail.com", phone: "07 89 45 12 30", address: "45 Avenue Foch, 69006 Lyon", joined: "02/11/2023", city: "Lyon" },
    { id: 3, name: "Lucas Morel", email: "l.morel@outlook.fr", phone: "06 55 44 33 22", address: "8 Impasse des Lilas, 31000 Toulouse", joined: "10/01/2024", city: "Toulouse" },
    { id: 4, name: "Sophie Roussel", email: "s.roussel@wanadoo.fr", phone: "06 01 02 03 04", address: "22 Boulevard Victor Hugo, 06000 Nice", joined: "20/08/2023", city: "Nice" },
    { id: 5, name: "Thomas Petit", email: "t.petit@protonmail.com", phone: "07 14 25 36 47", address: "5 Rue du Commerce, 44000 Nantes", joined: "05/12/2023", city: "Nantes" },
    { id: 6, name: "Camille Leroy", email: "c.leroy@yahoo.fr", phone: "06 99 88 77 66", address: "14 Quai de la Loire, 45000 Orléans", joined: "12/02/2024", city: "Orléans" },
];

export const VEHICLES: Vehicle[] = [
    { id: 1, ownerId: 1, brand: "Peugeot", model: "3008", plate: "AB-123-CD", year: 2021, type: "SUV", color: "Gris Platinium", mileage: 45000 },
    { id: 2, ownerId: 2, brand: "Renault", model: "Clio V", plate: "EF-456-GH", year: 2022, type: "Citadine", color: "Blanc Glacier", mileage: 12500 },
    { id: 3, ownerId: 3, brand: "Volkswagen", model: "Golf 8", plate: "IJ-789-KL", year: 2020, type: "Berline", color: "Bleu Atlantique", mileage: 68300 },
    { id: 4, ownerId: 4, brand: "Audi", model: "A3 Sportback", plate: "MN-012-OP", year: 2019, type: "Berline", color: "Noir Mythic", mileage: 82100 },
    { id: 5, ownerId: 5, brand: "Toyota", model: "Yaris Hybrid", plate: "QR-345-ST", year: 2023, type: "Citadine", color: "Rouge Intense", mileage: 5200 },
    { id: 6, ownerId: 6, brand: "Tesla", model: "Model 3", plate: "UV-678-WX", year: 2021, type: "Électrique", color: "Blanc Nacré", mileage: 33400 },
];

export const INTERVENTIONS: (Intervention & { mechanic: string })[] = [
    {
        id: "INT-2024-001",
        clientId: 1,
        vehicleId: 1,
        type: "Révision",
        status: "Terminé",
        dateIn: "2024-03-25",
        dateOut: "2024-03-25",
        symptoms: "Révision annuelle des 45000km",
        diagnostic: "Véhicule en bon état général. Prévoir plaquettes avant dans 10000km.",
        cost: 350.00,
        mechanic: "David Garcia"
    },
    {
        id: "INT-2024-002",
        clientId: 2,
        vehicleId: 2,
        type: "Carrosserie",
        status: "En cours",
        dateIn: "2024-03-26",
        dateOut: undefined,
        symptoms: "Rayure profonde portière arrière droite",
        diagnostic: "Peinture complète de l'élément nécessaire",
        cost: 450.00,
        mechanic: "Stéphane Lefebvre"
    },
    {
        id: "INT-2024-003",
        clientId: 3,
        vehicleId: 3,
        type: "Mécanique",
        status: "En attente",
        dateIn: "2024-03-27",
        dateOut: undefined,
        symptoms: "Bruit métallique train avant",
        diagnostic: "Biellettes de barre stabilisatrice HS",
        cost: 220.00,
        mechanic: "Nicolas Laurent"
    },
    {
        id: "INT-2024-004",
        clientId: 4,
        vehicleId: 4,
        type: "Pneumatiques",
        status: "Facturée",
        dateIn: "2024-03-24",
        dateOut: "2024-03-24",
        symptoms: "Changement 2 pneus avant",
        diagnostic: "Pneus usés à 80%. Remplacement effectué + géométrie.",
        cost: 380.00,
        mechanic: "David Garcia"
    },
];

export const INVOICES: Invoice[] = [
    { id: "FAC-2024-045", interventionId: "INT-2024-001", amount: 350.00, status: "Payée", date: "2024-03-25", method: "CB" },
    { id: "FAC-2024-046", interventionId: "INT-2024-004", amount: 380.00, status: "Payée", date: "2024-03-24", method: "Virement" },
    { id: "FAC-2024-047", interventionId: "INT-2024-002", amount: 450.00, status: "En attente", date: "2024-03-26" },
];

export const PRODUCTS: Product[] = [
    { id: 1, name: "Huile 5W30 5L", category: "Fluides", price: 65.00, stock: 45, minStock: 10, unit: "Bidon" },
    { id: 2, name: "Filtre à Huile PH6017", category: "Filtres", price: 15.50, stock: 12, minStock: 15, unit: "Pièce" },
    { id: 3, name: "Plaquettes de frein (jeu)", category: "Freinage", price: 85.00, stock: 8, minStock: 5, unit: "Jeu" },
    { id: 4, name: "Disque de frein ventilé", category: "Freinage", price: 120.00, stock: 4, minStock: 6, unit: "Pièce" },
    { id: 5, name: "Pneu Michelin Primacy 4", category: "Pneumatiques", price: 115.00, stock: 24, minStock: 8, unit: "Pièce" },
    { id: 6, name: "Ampoule H7", category: "Éclairage", price: 9.90, stock: 50, minStock: 20, unit: "Pièce" },
];

export const SERVICES: Service[] = [
    { id: 1, name: "Vidange + Filtre", price: 129.00, duration: "1h30", category: "Entretien" },
    { id: 2, name: "Révision Complète", price: 289.00, duration: "3h00", category: "Entretien" },
    { id: 3, name: "Parallélisme Train Avant", price: 75.00, duration: "1h00", category: "Géométrie" },
    { id: 4, name: "Peinture un élément", price: 350.00, duration: "4h00", category: "Carrosserie" },
    { id: 5, name: "Diagnostic Électronique", price: 65.00, duration: "0h45", category: "Diagnostic" },
];

export const ADMIN_STATS: Stat[] = [
    { label: "Clients Actifs", value: "324", icon: Users, color: "text-blue-500", trend: "+12.5%", trendType: "up" },
    { label: "Véhicules", value: "856", icon: Car, color: "text-purple-500", trend: "+5.2%", trendType: "up" },
    { label: "Opérations du mois", value: "1,240", icon: Wrench, color: "text-amber-500", trend: "+18.1%", trendType: "up" },
    { label: "Chiffre d'Affaires", value: "52,450 €", icon: TrendingUp, color: "text-emerald-500", trend: "+7.4%", trendType: "up" },
];

export const SECRETAIRE_STATS: Stat[] = [
    { label: "Clients Actifs", value: "324", icon: Users, color: "text-blue-500" },
    { label: "Factures Émises", value: "145", icon: FileText, color: "text-purple-500" },
    { label: "Montant Encaissé", value: "24,850 €", icon: Banknote, color: "text-emerald-500" },
    { label: "Alertes Stock", value: "3", icon: AlertTriangle, color: "text-red-500" },
];

export const RECEPTION_STATS: Stat[] = [
    { label: "Rendez-vous Jour", value: "12", icon: Clock, color: "text-blue-500" },
    { label: "Arrivées en attente", value: "4", icon: Car, color: "text-purple-500" },
    { label: "Véhicules en atelier", value: "18", icon: Wrench, color: "text-amber-500" },
    { label: "Prêts de véhicule", value: "2", icon: CheckCircle2, color: "text-emerald-500" },
];
