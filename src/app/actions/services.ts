"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ServiceSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    category: z.string().min(1, "La catégorie est requise"),
    price: z.coerce.number().min(0),
    duration: z.string().min(1, "La durée est requise"),
});

export async function getServices() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: "asc" }
        });
        return { success: true, data: services };
    } catch (error) {
        console.error("Error fetching services:", error);
        return { success: false, error: "Erreur lors de la récupération des services" };
    }
}

export async function createService(data: z.infer<typeof ServiceSchema>) {
    try {
        const validatedData = ServiceSchema.parse(data);
        const service = await prisma.service.create({
            data: validatedData,
        });
        revalidatePath("/admin/service");
        return { success: true, data: service };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Erreur lors de la création du service" };
    }
}

export async function updateService(id: string, data: Partial<z.infer<typeof ServiceSchema>>) {
    try {
        const service = await prisma.service.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/service");
        return { success: true, data: service };
    } catch (error) {
        return { success: false, error: "Erreur lors de la mise à jour du service" };
    }
}

export async function deleteService(id: string) {
    try {
        await prisma.service.delete({
            where: { id },
        });
        revalidatePath("/admin/service");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erreur lors de la suppression du service" };
    }
}
