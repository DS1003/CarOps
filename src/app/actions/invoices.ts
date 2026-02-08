"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInvoices() {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                intervention: {
                    include: {
                        client: true,
                        vehicle: true,
                    }
                }
            },
            orderBy: { date: "desc" }
        });

        const serializedInvoices = invoices.map(inv => ({
            ...inv,
            date: inv.date.toISOString(),
            intervention: {
                ...inv.intervention,
                dateIn: inv.intervention.dateIn.toISOString(),
                dateOut: inv.intervention.dateOut?.toISOString() || null,
                client: {
                    ...inv.intervention.client,
                    joinedAt: inv.intervention.client.joinedAt.toISOString(),
                },
                vehicle: {
                    ...inv.intervention.vehicle,
                    createdAt: inv.intervention.vehicle.createdAt.toISOString(),
                }
            }
        }));

        return { success: true, data: serializedInvoices };
    } catch (error) {
        return { success: false, error: "Erreur" };
    }
}

export async function createInvoice(data: any) {
    try {
        const { interventionId, amount, status } = data;

        // Generate Invoice ID like FAC-2024-001
        const year = new Date().getFullYear();
        const count = await prisma.invoice.count({
            where: {
                date: {
                    gte: new Date(year, 0, 1),
                    lt: new Date(year + 1, 0, 1)
                }
            }
        });
        const id = `FAC-${year}-${(count + 1).toString().padStart(3, '0')}`;

        const invoice = await prisma.$transaction(async (tx) => {
            const newInvoice = await tx.invoice.create({
                data: {
                    id,
                    interventionId,
                    amount: parseFloat(amount),
                    status,
                },
            });

            // Mark intervention as invoiced
            await tx.intervention.update({
                where: { id: interventionId },
                data: { status: "Facturée" }
            });

            return newInvoice;
        });

        revalidatePath("/secretaire");
        revalidatePath("/admin/facture");
        return { success: true, data: invoice };
    } catch (error) {
        console.error("Create Invoice Error:", error);
        return { success: false, error: "Erreur lors de la création de la facture" };
    }
}

export async function updateInvoiceStatus(id: string, status: string) {
    try {
        await prisma.invoice.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/secretaire");
        revalidatePath("/admin/facture");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erreur" };
    }
}
