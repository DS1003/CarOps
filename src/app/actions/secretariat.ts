"use server";

import { prisma } from "@/lib/prisma";

export async function getSecretariatStats() {
    try {
        const [invoices, clientsCount, products] = await Promise.all([
            prisma.invoice.findMany({
                include: {
                    intervention: {
                        include: {
                            client: true
                        }
                    }
                },
                orderBy: { date: "desc" }
            }),
            prisma.client.count(),
            prisma.product.findMany()
        ]);

        const productsCount = products.filter(p => p.stock <= p.minStock).length;

        const totalEncaisse = invoices
            .filter(i => i.status === "Payée")
            .reduce((sum, i) => sum + i.amount, 0);

        const pendingInvoices = invoices.filter(i => i.status === "En attente");

        return {
            success: true,
            data: {
                stats: [
                    { label: "Clients Actifs", value: clientsCount.toString(), color: "text-blue-500" },
                    { label: "Factures Émises", value: invoices.length.toString(), color: "text-purple-500" },
                    { label: "Montant Encaissé", value: `${totalEncaisse.toLocaleString()} €`, color: "text-emerald-500" },
                    { label: "Alertes Stock", value: productsCount.toString(), color: "text-red-500" },
                ],
                pendingInvoices: pendingInvoices.map(inv => ({
                    id: inv.id,
                    clientName: inv.intervention.client.name,
                    date: inv.date,
                    amount: inv.amount,
                }))
            }
        };
    } catch (error) {
        console.error("Secretariat Stats Error:", error);
        return { success: false, error: "Erreur" };
    }
}
