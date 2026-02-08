"use client";

import { clients } from "@/data/clients";
import {
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ClientsPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">Gérez votre base de données clients et leurs véhicules.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Nouveau Client
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Rechercher un client..." className="pl-10" />
                        </div>
                        <Button variant="outline">Filtres</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left font-medium text-muted-foreground">
                                    <th className="py-4 px-4">Client</th>
                                    <th className="py-4 px-4">Coordonnées</th>
                                    <th className="py-4 px-4">Véhicules</th>
                                    <th className="py-4 px-4">Dernière visite</th>
                                    <th className="py-4 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{client.name}</span>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                    <MapPin className="h-3 w-3" /> {client.address}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Mail className="h-3 w-3 text-muted-foreground" /> {client.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Phone className="h-3 w-3 text-muted-foreground" /> {client.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Car className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium text-lg">{client.vehicles}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-muted-foreground">
                                            {new Date(client.lastVisit).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
