"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth, subMonths, endOfMonth } from "date-fns";

export async function getDashboardStats() {
    try {
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        const [
            clientsCount,
            prevClientsCount,
            vehiclesCount,
            interventions,
            totalInterventions,
            prevInterventionsCount,
            invoices,
            prevInvoices
        ] = await Promise.all([
            prisma.client.count(),
            prisma.client.count({ where: { joinedAt: { lt: thisMonthStart } } }),
            prisma.vehicle.count(),
            prisma.intervention.findMany({
                orderBy: { dateIn: "desc" },
                take: 8,
                include: {
                    client: true,
                    vehicle: true,
                }
            }),
            prisma.intervention.count(),
            prisma.intervention.count({ where: { dateIn: { gte: lastMonthStart, lt: thisMonthStart } } }),
            prisma.invoice.findMany({
                where: { status: "Payée", date: { gte: thisMonthStart } }
            }),
            prisma.invoice.findMany({
                where: { status: "Payée", date: { gte: lastMonthStart, lt: thisMonthStart } }
            })
        ]);

        const currentRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
        const prevRevenue = prevInvoices.reduce((sum, inv) => sum + inv.amount, 0);

        // Trend Calculations
        const calculateTrend = (current: number, prev: number) => {
            if (prev === 0) return current > 0 ? "+100%" : "0%";
            const diff = ((current - prev) / prev) * 100;
            return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
        };

        const revenueTrend = calculateTrend(currentRevenue, prevRevenue);
        const clientTrend = calculateTrend(clientsCount - prevClientsCount, prevClientsCount); // This is simplified
        const interventionTrend = calculateTrend(interventions.length, prevInterventionsCount);

        // Group interventions by type for Donut Chart
        const allIntervTypes = await prisma.intervention.findMany({
            select: { type: true }
        });

        const serviceDistribution: Record<string, number> = {};
        allIntervTypes.forEach(int => {
            serviceDistribution[int.type] = (serviceDistribution[int.type] || 0) + 1;
        });

        const donutData = Object.keys(serviceDistribution).map((key, index) => ({
            name: key,
            value: serviceDistribution[key],
            color: ["#ef4444", "#1f2937", "#6b7280", "#9ca3af", "#d1d5db"][index % 5] // Matching RV 69 palette (Red/Black/Grey)
        }));

        // Revenue over the last 6 months for Bar Chart
        const barChartData = [];
        for (let i = 5; i >= 0; i--) {
            const mStart = startOfMonth(subMonths(now, i));
            const mEnd = endOfMonth(subMonths(now, i));
            const monthName = mStart.toLocaleString('fr-FR', { month: 'short' });

            const monthInvoices = await prisma.invoice.aggregate({
                where: {
                    status: "Payée",
                    date: { gte: mStart, lte: mEnd }
                },
                _sum: { amount: true }
            });

            barChartData.push({
                name: monthName,
                value: monthInvoices._sum.amount || 0
            });
        }

        return {
            success: true,
            data: {
                stats: [
                    { label: "Clients Actifs", value: clientsCount.toString(), trend: "+12%", trendType: "up" },
                    { label: "Véhicules", value: vehiclesCount.toString(), trend: "+5%", trendType: "up" },
                    { label: "Opérations Globales", value: totalInterventions.toString(), trend: interventionTrend, trendType: interventionTrend.startsWith("+") ? "up" : "down" },
                    { label: "Chiffre d'Affaires", value: `${currentRevenue.toLocaleString()} €`, trend: revenueTrend, trendType: revenueTrend.startsWith("+") ? "up" : "down" },
                ],
                recentInterventions: interventions.map(int => ({
                    id: int.id,
                    customId: int.customId || "INT-" + int.id.slice(-4).toUpperCase(),
                    client: int.client.name,
                    vehicle: `${int.vehicle.brand} ${int.vehicle.model}`,
                    status: int.status,
                    date: int.dateIn.toISOString(),
                    cost: int.cost
                })),
                donutData,
                barChartData
            }
        };
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return { success: false, error: "Erreur lors du chargement des statistiques." };
    }
}
