"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProductSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    category: z.string().min(1, "La catégorie est requise"),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().min(0),
    minStock: z.coerce.number().min(0),
    unit: z.string().min(1),
});

export async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: "asc" }
        });
        return { success: true, data: products };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, error: "Erreur lors de la récupération des produits" };
    }
}

export async function createProduct(data: z.infer<typeof ProductSchema>) {
    try {
        const validatedData = ProductSchema.parse(data);
        const product = await prisma.product.create({
            data: validatedData,
        });
        revalidatePath("/admin/stock");
        revalidatePath("/atelier/produit");
        return { success: true, data: product };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Erreur lors de la création du produit" };
    }
}

export async function updateProduct(id: string, data: Partial<z.infer<typeof ProductSchema>>) {
    try {
        const product = await prisma.product.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/stock");
        return { success: true, data: product };
    } catch (error) {
        return { success: false, error: "Erreur lors de la mise à jour du produit" };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        });
        revalidatePath("/admin/stock");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erreur lors de la suppression du produit" };
    }
}
