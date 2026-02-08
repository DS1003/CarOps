"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uploadImage } from "@/lib/cloudinary";

const VehicleSchema = z.object({
    brand: z.string().min(1, "La marque est requise"),
    model: z.string().min(1, "Le modèle est requis"),
    plate: z.string().min(1, "L'immatriculation est requise"),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    type: z.string().min(1, "Le type est requis"),
    color: z.string().min(1, "La couleur est requise"),
    mileage: z.coerce.number().min(0),
    ownerId: z.string().min(1, "Le propriétaire est requis"),
});

export async function getVehicles() {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: {
                owner: true
            },
            orderBy: { createdAt: "desc" }
        });

        const serializedVehicles = vehicles.map(vehicle => ({
            ...vehicle,
            createdAt: vehicle.createdAt.toISOString(),
            owner: {
                ...vehicle.owner,
                joinedAt: vehicle.owner.joinedAt.toISOString()
            }
        }));

        return { success: true, data: serializedVehicles };
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return { success: false, error: "Erreur lors de la récupération des véhicules" };
    }
}

export async function createVehicle(formData: FormData) {
    try {
        const brand = formData.get("brand") as string;
        const model = formData.get("model") as string;
        const plate = formData.get("plate") as string;
        const year = formData.get("year") as string;
        const type = formData.get("type") as string;
        const color = formData.get("color") as string;
        const mileage = formData.get("mileage") as string;
        const ownerId = formData.get("ownerId") as string;
        const image = formData.get("image") as File;

        const validatedData = VehicleSchema.parse({
            brand, model, plate, year, type, color, mileage, ownerId
        });

        let imageUrl = null;
        if (image && image.size > 0) {
            const uploadResult = await uploadImage(image);
            imageUrl = uploadResult.secure_url;
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                ...validatedData,
                imageUrl
            },
        });

        revalidatePath("/admin/vehicule");
        revalidatePath("/reception/vehicule");
        return { success: true, data: vehicle };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Error creating vehicle:", error);
        return { success: false, error: "Erreur lors de la création du véhicule" };
    }
}

export async function createVehicleQuick(data: z.infer<typeof VehicleSchema>) {
    try {
        const validatedData = VehicleSchema.parse(data);
        const vehicle = await prisma.vehicle.create({
            data: validatedData,
        });
        revalidatePath("/admin/vehicule");
        revalidatePath("/reception/vehicule");
        return { success: true, data: vehicle };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Error creating vehicle quick:", error);
        return { success: false, error: "Erreur lors de la création du véhicule" };
    }
}

export async function updateVehicle(id: string, formData: FormData) {
    try {
        const brand = formData.get("brand") as string;
        const model = formData.get("model") as string;
        const plate = formData.get("plate") as string;
        const year = formData.get("year") as string;
        const type = formData.get("type") as string;
        const color = formData.get("color") as string;
        const mileage = formData.get("mileage") as string;
        const image = formData.get("image") as File;

        let updateData: any = {
            brand, model, plate, year: Number(year), type, color, mileage: Number(mileage)
        };

        if (image && image.size > 0) {
            const uploadResult = await uploadImage(image);
            updateData.imageUrl = uploadResult.secure_url;
        }

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/vehicule");
        return { success: true, data: vehicle };
    } catch (error) {
        console.error("Error updating vehicle:", error);
        return { success: false, error: "Erreur lors de la mise à jour du véhicule" };
    }
}

export async function deleteVehicle(id: string) {
    try {
        await prisma.vehicle.delete({
            where: { id },
        });
        revalidatePath("/admin/vehicule");
        return { success: true };
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return { success: false, error: "Erreur lors de la suppression du véhicule" };
    }
}
