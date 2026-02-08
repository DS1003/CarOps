import {
    LayoutDashboard,
    Users,
    Car,
    FileText as FileInvoice,
    Wrench as Tools,
    UserCog,
    SlidersHorizontal,
    Box,
    ClipboardList,
    Banknote
} from "lucide-react";
import { NavSection } from "@/types";

export const ADMIN_NAVIGATION: NavSection[] = [
    {
        title: "PRINCIPAL",
        items: [
            { label: "Tableau de bord", icon: LayoutDashboard, href: "/admin" },
            { label: "Utilisateurs", icon: Users, href: "/admin/utilisateurs" },
        ]
    },
    {
        title: "GESTION CLIENTÈLE",
        items: [
            { label: "Clients", icon: Users, href: "/admin/client" },
            { label: "Véhicules", icon: Car, href: "/admin/vehicule" },
        ]
    },
    {
        title: "INTERVENTIONS",
        items: [
            { label: "Fiches d'intervention", icon: ClipboardList, href: "/admin/intervention" },
            { label: "Services", icon: Tools, href: "/admin/service" },
        ]
    },
    {
        title: "FACTURATION",
        items: [
            { label: "Factures", icon: FileInvoice, href: "/admin/facture" },
            { label: "Paiements", icon: Banknote, href: "/admin/paiement" },
        ]
    },
    {
        title: "STOCK",
        items: [
            { label: "Produits", icon: Box, href: "/admin/produit" },
        ]
    },
    {
        title: "PARAMÈTRES",
        items: [
            { label: "Mon profil", icon: UserCog, href: "/admin/profile" },
            { label: "Préférences", icon: SlidersHorizontal, href: "/admin/preferences" },
        ]
    }
];

export const RECEPTION_NAVIGATION: NavSection[] = [
    {
        title: "PRINCIPAL",
        items: [
            { label: "Tableau de bord", icon: LayoutDashboard, href: "/reception" },
        ]
    },
    {
        title: "GESTION CLIENTS",
        items: [
            { label: "Liste des clients", icon: Users, href: "/reception/client" },
            { label: "Ajouter un client", icon: Users, href: "/reception/client/nouveau" },
        ]
    },
    {
        title: "VÉHICULES",
        items: [
            { label: "Liste des véhicules", icon: Car, href: "/reception/vehicule" },
            { label: "Ajouter un véhicule", icon: Car, href: "/reception/vehicule/nouveau" },
        ]
    },
    {
        title: "INTERVENTIONS",
        items: [
            { label: "Liste des interventions", icon: ClipboardList, href: "/reception/intervention" },
            { label: "Nouvelle intervention", icon: ClipboardList, href: "/reception/intervention/nouveau" },
        ]
    },
    {
        title: "STOCK",
        items: [
            { label: "Produits", icon: Box, href: "/reception/produit" },
        ]
    }
];

export const SECRETAIRE_NAVIGATION: NavSection[] = [
    {
        title: "PRINCIPAL",
        items: [
            { label: "Tableau de bord", icon: LayoutDashboard, href: "/secretaire" },
        ]
    },
    {
        title: "INTERVENTIONS",
        items: [
            { label: "Liste des interventions", icon: ClipboardList, href: "/secretaire/intervention" },
            { label: "Services", icon: Tools, href: "/secretaire/service" },
            { label: "Produits", icon: Box, href: "/secretaire/produit" },
        ]
    },
    {
        title: "FACTURATION & PAIEMENT",
        items: [
            { label: "Factures", icon: FileInvoice, href: "/secretaire/facture" },
            { label: "Paiements", icon: Banknote, href: "/secretaire/paiement" },
            { label: "Encaissement", icon: Banknote, href: "/secretaire/paiement/nouveau" },
        ]
    },
    {
        title: "CLIENTS & VÉHICULES",
        items: [
            { label: "Clients", icon: Users, href: "/secretaire/client" },
            { label: "Véhicules", icon: Car, href: "/secretaire/vehicule" },
        ]
    },
];

export const ATELIER_NAVIGATION: NavSection[] = [
    {
        title: "PRINCIPAL",
        items: [
            { label: "Atelier", icon: LayoutDashboard, href: "/atelier" },
        ]
    },
    {
        title: "STOCK",
        items: [
            { label: "Produits", icon: Box, href: "/atelier/produit" },
        ]
    }
];
