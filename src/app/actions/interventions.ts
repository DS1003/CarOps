"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const InterventionSchema = z.object({
    clientId: z.string().min(1),
    vehicleId: z.string().min(1),
    selectedServices: z.array(z.string()).min(1),
    addedProducts: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number()
    })).optional(),
    symptoms: z.string().min(1),
    status: z.string().default("En attente"),
    cost: z.coerce.number().default(0),
    condition: z.string().optional(),
    cleanliness: z.string().optional(),
    fuelLevel: z.string().optional(),
    paymentMethod: z.string().optional(),
    paymentStatus: z.string().optional(),
});

export async function getInterventions() {
    try {
        const interventions = await prisma.intervention.findMany({
            include: {
                client: true,
                vehicle: true,
                invoice: true,
            },
            orderBy: { dateIn: "desc" }
        });
        const serializedInterventions = interventions.map(intervention => ({
            ...intervention,
            dateIn: intervention.dateIn.toISOString(),
            dateOut: intervention.dateOut ? intervention.dateOut.toISOString() : null,
            vehicle: {
                ...intervention.vehicle,
                createdAt: intervention.vehicle.createdAt.toISOString()
            },
            client: {
                ...intervention.client,
                joinedAt: intervention.client.joinedAt.toISOString()
            },
            invoice: intervention.invoice ? {
                ...intervention.invoice,
                date: intervention.invoice.date.toISOString()
            } : null
        }));
        return { success: true, data: serializedInterventions };
    } catch (error) {
        return { success: false, error: "Erreur" };
    }
}

export async function createIntervention(data: any) {
    try {
        const validatedData = InterventionSchema.parse(data);

        const { paymentMethod, paymentStatus, selectedServices, addedProducts, ...otherData } = validatedData;
        const year = new Date().getFullYear();

        // Custom ID for Intervention
        const count = await prisma.intervention.count({
            where: { dateIn: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } }
        });
        const customId = `INT-${year}-${(count + 1).toString().padStart(3, '0')}`;

        // Prepare data for Prisma
        const intervention = await prisma.intervention.create({
            data: {
                ...otherData,
                type: selectedServices.join(", "),
                services: selectedServices as any,
                products: addedProducts as any,
                customId,
                client: { connect: { id: validatedData.clientId } },
                vehicle: { connect: { id: validatedData.vehicleId } }
            } as any,
        });

        // Create Invoice if paid now
        if (paymentStatus === "Encaisser maintenant" && validatedData.cost > 0) {
            const invCount = await prisma.invoice.count({
                where: { date: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } }
            });
            const invCustomId = `FAC-${year}-${(invCount + 1).toString().padStart(3, '0')}`;

            await prisma.invoice.create({
                data: {
                    amount: validatedData.cost,
                    method: paymentMethod || "Espèces",
                    status: "Payée",
                    customId: invCustomId,
                    interventionId: intervention.id
                }
            });

            // Update Intervention Status to Facturée
            await prisma.intervention.update({
                where: { id: intervention.id },
                data: { status: "Facturée" }
            });
        }

        revalidatePath("/admin/intervention");
        revalidatePath("/reception");
        revalidatePath("/atelier");
        return { success: true, data: intervention };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Erreur lors de la création de l'intervention" };
    }
}

export async function updateIntervention(id: string, data: any) {
    try {
        const intervention = await prisma.intervention.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/intervention");
        revalidatePath("/atelier");
        revalidatePath("/reception");
        return { success: true, data: intervention };
    } catch (error) {
        return { success: false, error: "Erreur lors de la mise à jour" };
    }
}

export async function getInterventionById(id: string) {
    try {
        const intervention = await prisma.intervention.findUnique({
            where: { id },
            include: {
                client: true,
                vehicle: true,
            }
        });
        return { success: true, data: intervention };
    } catch (error) {
        return { success: false, error: "Erreur" };
    }
}
