import { DashboardClient } from "@/types";

export const clients: DashboardClient[] = [
    { id: "1", name: "Jean Dupont", email: "jean.dupont@email.com", phone: "06 12 34 56 78", address: "123 Rue de Paris, Paris", vehicles: 2, lastVisit: "2024-01-15" },
    { id: "2", name: "Marie Martin", email: "m.martin@gmail.com", phone: "06 98 76 54 32", address: "45 Avenue des Champs, Lyon", vehicles: 1, lastVisit: "2024-02-01" },
    { id: "3", name: "Pierre Durand", email: "pierre.durand@outlook.fr", phone: "07 45 12 89 56", address: "8 Impasse du Garage, Bordeaux", vehicles: 3, lastVisit: "2024-01-20" },
    { id: "4", name: "Sophie Lefebvre", email: "s.lefeb@yahoo.fr", phone: "06 11 22 33 44", address: "22 Boulevard Victor Hugo, Nantes", vehicles: 1, lastVisit: "2023-12-10" },
    { id: "5", name: "Michel Bernard", email: "michel.b@orange.fr", phone: "06 55 66 77 88", address: "5 Rue de la Paix, Marseille", vehicles: 4, lastVisit: "2024-02-10" },
];
