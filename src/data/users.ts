import { AppUser } from "@/types";

export const users: AppUser[] = [
    { id: "1", name: "Admin Principal", email: "admin@garage.com", role: "Administrateur", active: true },
    { id: "2", name: "Jean Réception", email: "jean@garage.com", role: "Réceptionniste", active: true },
    { id: "3", name: "Sophie Secrétariat", email: "sophie@garage.com", role: "Secrétaire", active: true },
    { id: "4", name: "Marc Mécano", email: "marc@garage.com", role: "Mécanicien", active: true },
];
