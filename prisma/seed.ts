import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLIENTS = [
    { id: 1, name: "Jean-Pierre Bernard", email: "jp.bernard@email.fr", phone: "06 12 34 56 78", address: "12 Rue de la Paix, 75002 Paris", joined: "15/05/2023", city: "Paris" },
    { id: 2, name: "Marie-Louise Dubois", email: "ml.dubois@gmail.com", phone: "07 89 45 12 30", address: "45 Avenue Foch, 69006 Lyon", joined: "02/11/2023", city: "Lyon" },
    { id: 3, name: "Lucas Morel", email: "l.morel@outlook.fr", phone: "06 55 44 33 22", address: "8 Impasse des Lilas, 31000 Toulouse", joined: "10/01/2024", city: "Toulouse" },
    { id: 4, name: "Sophie Roussel", email: "s.roussel@wanadoo.fr", phone: "06 01 02 03 04", address: "22 Boulevard Victor Hugo, 06000 Nice", joined: "20/08/2023", city: "Nice" },
    { id: 5, name: "Thomas Petit", email: "t.petit@protonmail.com", phone: "07 14 25 36 47", address: "5 Rue du Commerce, 44000 Nantes", joined: "05/12/2023", city: "Nantes" },
    { id: 6, name: "Camille Leroy", email: "c.leroy@yahoo.fr", phone: "06 99 88 77 66", address: "14 Quai de la Loire, 45000 Orléans", joined: "12/02/2024", city: "Orléans" },
];

const VEHICLES = [
    { id: 1, ownerId: 1, brand: "Peugeot", model: "3008", plate: "AB-123-CD", year: 2021, type: "SUV", color: "Gris Platinium", mileage: 45000 },
    { id: 2, ownerId: 2, brand: "Renault", model: "Clio V", plate: "EF-456-GH", year: 2022, type: "Citadine", color: "Blanc Glacier", mileage: 12500 },
    { id: 3, ownerId: 3, brand: "Volkswagen", model: "Golf 8", plate: "IJ-789-KL", year: 2020, type: "Berline", color: "Bleu Atlantique", mileage: 68300 },
    { id: 4, ownerId: 4, brand: "Audi", model: "A3 Sportback", plate: "MN-012-OP", year: 2019, type: "Berline", color: "Noir Mythic", mileage: 82100 },
    { id: 5, ownerId: 5, brand: "Toyota", model: "Yaris Hybrid", plate: "QR-345-ST", year: 2023, type: "Citadine", color: "Rouge Intense", mileage: 5200 },
    { id: 6, ownerId: 6, brand: "Tesla", model: "Model 3", plate: "UV-678-WX", year: 2021, type: "Électrique", color: "Blanc Nacré", mileage: 33400 },
];

const INTERVENTIONS = [
    {
        id: "INT-2024-001",
        clientId: 1,
        vehicleId: 1,
        type: "Révision",
        status: "Terminé",
        dateIn: "2024-03-25",
        dateOut: "2024-03-25",
        symptoms: "Révision annuelle des 45000km",
        diagnostic: "Véhicule en bon état général. Prévoir plaquettes avant dans 10000km.",
        cost: 350.00,
    },
    {
        id: "INT-2024-002",
        clientId: 2,
        vehicleId: 2,
        type: "Carrosserie",
        status: "En cours",
        dateIn: "2024-03-26",
        dateOut: null,
        symptoms: "Rayure profonde portière arrière droite",
        diagnostic: "Peinture complète de l'élément nécessaire",
        cost: 450.00,
    },
    {
        id: "INT-2024-003",
        clientId: 3,
        vehicleId: 3,
        type: "Mécanique",
        status: "En attente",
        dateIn: "2024-03-27",
        dateOut: null,
        symptoms: "Bruit métallique train avant",
        diagnostic: "Biellettes de barre stabilisatrice HS",
        cost: 220.00,
    },
    {
        id: "INT-2024-004",
        clientId: 4,
        vehicleId: 4,
        type: "Pneumatiques",
        status: "Facturée",
        dateIn: "2024-03-24",
        dateOut: "2024-03-24",
        symptoms: "Changement 2 pneus avant",
        diagnostic: "Pneus usés à 80%. Remplacement effectué + géométrie.",
        cost: 380.00,
    },
];

const INVOICES = [
    { id: "FAC-2024-045", interventionId: "INT-2024-001", amount: 350.00, status: "Payée", date: "2024-03-25", method: "CB" },
    { id: "FAC-2024-046", interventionId: "INT-2024-004", amount: 380.00, status: "Payée", date: "2024-03-24", method: "Virement" },
    { id: "FAC-2024-047", interventionId: "INT-2024-002", amount: 450.00, status: "En attente", date: "2024-03-26" },
];

const PRODUCTS = [
    { name: "Huile 5W30 5L", category: "Fluides", price: 65.00, stock: 45, minStock: 10, unit: "Bidon" },
    { name: "Filtre à Huile PH6017", category: "Filtres", price: 15.50, stock: 12, minStock: 15, unit: "Pièce" },
    { name: "Plaquettes de frein (jeu)", category: "Freinage", price: 85.00, stock: 8, minStock: 5, unit: "Jeu" },
    { name: "Disque de frein ventilé", category: "Freinage", price: 120.00, stock: 4, minStock: 6, unit: "Pièce" },
    { name: "Pneu Michelin Primacy 4", category: "Pneumatiques", price: 115.00, stock: 24, minStock: 8, unit: "Pièce" },
    { name: "Ampoule H7", category: "Éclairage", price: 9.90, stock: 50, minStock: 20, unit: "Pièce" },
];

const SERVICES = [
    { name: "Vidange + Filtre", price: 129.00, duration: "1h30", category: "Entretien" },
    { name: "Révision Complète", price: 289.00, duration: "3h00", category: "Entretien" },
    { name: "Parallélisme Train Avant", price: 75.00, duration: "1h00", category: "Géométrie" },
    { name: "Peinture un élément", price: 350.00, duration: "4h00", category: "Carrosserie" },
    { name: "Diagnostic Électronique", price: 65.00, duration: "0h45", category: "Diagnostic" },
];

const USERS = [
    { name: "Admin CarOps", email: "admin@carops.fr", role: "ADMIN" },
    { name: "Réceptionniste", email: "reception@carops.fr", role: "RECEPTION" },
    { name: "Secrétaire", email: "secretaire@carops.fr", role: "SECRETAIRE" },
    { name: "Mécanicien David", email: "meca.david@carops.fr", role: "ATELIER" },
];

async function main() {
    console.log("Start seeding...");

    // Clear existing data
    await prisma.invoice.deleteMany();
    await prisma.intervention.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.client.deleteMany();
    await prisma.product.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();

    // Clients mapping
    const clientMap: Record<number, string> = {};
    for (const c of CLIENTS) {
        const client = await prisma.client.create({
            data: {
                name: c.name,
                email: c.email,
                phone: c.phone,
                address: c.address,
                city: c.city,
            }
        });
        clientMap[c.id] = client.id;
    }

    // Vehicles mapping
    const vehicleMap: Record<number, string> = {};
    for (const v of VEHICLES) {
        const vehicle = await prisma.vehicle.create({
            data: {
                brand: v.brand,
                model: v.model,
                plate: v.plate,
                year: v.year,
                type: v.type,
                color: v.color,
                mileage: v.mileage,
                ownerId: clientMap[v.ownerId],
            }
        });
        vehicleMap[v.id] = vehicle.id;
    }

    // Interventions mapping
    const interventionMap: Record<string, string> = {};
    for (const i of INTERVENTIONS) {
        const intervention = await prisma.intervention.create({
            data: {
                customId: i.id,
                type: i.type,
                status: i.status,
                dateIn: new Date(i.dateIn),
                dateOut: i.dateOut ? new Date(i.dateOut) : null,
                symptoms: i.symptoms,
                diagnostic: i.diagnostic,
                cost: i.cost,
                clientId: clientMap[i.clientId],
                vehicleId: vehicleMap[i.vehicleId],
            }
        });
        interventionMap[i.id] = intervention.id;
    }

    // Invoices
    for (const inv of INVOICES) {
        await prisma.invoice.create({
            data: {
                customId: inv.id,
                amount: inv.amount,
                status: inv.status,
                date: new Date(inv.date),
                method: inv.method,
                interventionId: interventionMap[inv.interventionId],
            }
        });
    }

    // Products
    for (const p of PRODUCTS) {
        await prisma.product.create({
            data: p
        });
    }

    // Services
    for (const s of SERVICES) {
        await prisma.service.create({
            data: s
        });
    }

    // Users
    for (const u of USERS) {
        await prisma.user.create({
            data: u
        });
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
