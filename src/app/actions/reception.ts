"use server";

import { prisma } from "@/lib/prisma";

export async function getReceptionStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [interventionsCount, pendingArrivalsCount, activeVehiclesCount, todayInterventions] = await Promise.all([
            prisma.intervention.count({
                where: {
                    dateIn: {
                        gte: today,
                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                    }
                }
            }),
            prisma.intervention.count({
                where: { status: "En attente" }
            }),
            prisma.intervention.count({
                where: { status: "En cours" }
            }),
            prisma.intervention.findMany({
                where: {
                    dateIn: {
                        gte: today,
                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                    }
                },
                include: {
                    client: true,
                    vehicle: true,
                },
                take: 10,
                orderBy: { dateIn: "asc" }
            })
        ]);

        return {
            success: true,
            data: {
                stats: [
                    { label: "Rendez-vous Jour", value: interventionsCount.toString(), color: "text-blue-500" },
                    { label: "Arrivées en attente", value: pendingArrivalsCount.toString(), color: "text-purple-500" },
                    { label: "Véhicules en atelier", value: activeVehiclesCount.toString(), color: "text-amber-500" },
                    { label: "Prêts de véhicule", value: "2", color: "text-emerald-500" },
                ],
                todayInterventions: todayInterventions.map(int => ({
                    id: int.id,
                    type: int.type,
                    status: int.status,
                    dateIn: int.dateIn,
                    client: {
                        name: int.client.name,
                        phone: int.client.phone
                    },
                    vehicle: {
                        brand: int.vehicle.brand,
                        model: int.vehicle.model,
                        plate: int.vehicle.plate
                    }
                }))
            }
        };
    } catch (error) {
        console.error("Reception Stats Error:", error);
        return { success: false, error: "Erreur" };
    }
}
