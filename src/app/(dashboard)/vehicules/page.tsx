"use client";

import { vehicles } from "@/data/vehicles";
import {
    Plus,
    Car,
    Settings,
    Calendar,
    Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VehiclesPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Véhicules</h1>
                    <p className="text-muted-foreground">Consultez et gérez le parc automobile de vos clients.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Ajouter un Véhicule
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="overflow-hidden group hover:border-primary/50 transition-all">
                        <div className="h-2 bg-primary" />
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Car className="h-6 w-6" />
                                </div>
                                <div className="px-3 py-1 bg-muted rounded-md text-xs font-mono font-bold tracking-wider">
                                    {vehicle.registration}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">{vehicle.manufacturer} {vehicle.model}</h3>
                                    <p className="text-sm text-muted-foreground italic">Propriétaire: {vehicle.owner}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Année: {vehicle.year}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Gauge className="h-4 w-4" />
                                        <span>{vehicle.mileage}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1">Gérer</Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
