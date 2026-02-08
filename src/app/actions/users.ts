"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    role: z.string(),
});

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" }
        });

        const serializedUsers = users.map(user => ({
            ...user,
            createdAt: user.createdAt.toISOString()
        }));

        return { success: true, data: serializedUsers };
    } catch (error) {
        return { success: false, error: "Erreur lors de la récupération des utilisateurs" };
    }
}

export async function createUser(data: z.infer<typeof UserSchema>) {
    try {
        const validatedData = UserSchema.parse(data);
        const user = await prisma.user.create({
            data: validatedData,
        });
        revalidatePath("/admin/utilisateurs");
        return { success: true, data: user };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Erreur lors de la création de l'utilisateur" };
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id },
        });
        revalidatePath("/admin/utilisateurs");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erreur lors de la suppression de l'utilisateur" };
    }
}
