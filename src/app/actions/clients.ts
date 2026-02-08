"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ClientSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    phone: z.string().min(8, "Numéro de téléphone invalide"),
    address: z.string().optional().default(""),
    city: z.string().optional().default("Sénégal"),
});

export async function getClients() {
    try {
        const clients = await prisma.client.findMany({
            include: {
                _count: {
                    select: { vehicles: true }
                }
            },
            orderBy: { joinedAt: "desc" }
        });

        const serializedClients = clients.map(client => ({
            ...client,
            joinedAt: client.joinedAt.toISOString()
        }));

        return { success: true, data: serializedClients };
    } catch (error) {
        console.error("Error fetching clients:", error);
        return { success: false, error: "Erreur lors de la récupération des clients" };
    }
}

export async function getClientById(id: string) {
    try {
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                vehicles: true,
                interventions: {
                    orderBy: { dateIn: "desc" }
                }
            }
        });
        return { success: true, data: client };
    } catch (error) {
        console.error("Error fetching client:", error);
        return { success: false, error: "Erreur lors de la récupération du client" };
    }
}

export async function createClient(data: any) {
    try {
        const validatedData = ClientSchema.parse(data);

        console.log("DEBUG - Creating client with data:", validatedData);

        const client = await prisma.client.create({
            data: {
                name: validatedData.name,
                phone: validatedData.phone,
                address: validatedData.address || "",
                city: validatedData.city || "Sénégal",
                email: validatedData.email && validatedData.email.trim() !== "" ? validatedData.email : undefined,
            },
        });

        console.log("DEBUG - Client created successfully:", client.id);

        revalidatePath("/admin/client");
        revalidatePath("/reception/client");

        return { success: true, data: client };
    } catch (error: any) {
        console.error("CRITICAL - Client Creation Failed:", error);

        if (error instanceof z.ZodError) {
            return { success: false, error: "Validation échouée: " + error.issues[0].message };
        }

        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0] || "donnée";
            return { success: false, error: `Cette valeur (${field}) est déjà utilisée.` };
        }

        return {
            success: false,
            error: "Erreur technique lors de la création. Veuillez contacter le support."
        };
    }
}

export async function updateClient(id: string, data: Partial<z.infer<typeof ClientSchema>>) {
    try {
        const client = await prisma.client.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/client");
        revalidatePath(`/reception/client/${id}`);
        return { success: true, data: client };
    } catch (error) {
        console.error("Error updating client:", error);
        return { success: false, error: "Erreur lors de la mise à jour du client" };
    }
}

export async function deleteClient(id: string) {
    try {
        await prisma.client.delete({
            where: { id },
        });
        revalidatePath("/admin/client");
        return { success: true };
    } catch (error) {
        console.error("Error deleting client:", error);
        return { success: false, error: "Erreur lors de la suppression du client" };
    }
}
