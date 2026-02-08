"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Wrench, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulation de connexion
        setTimeout(() => {
            router.push("/dashboard");
        }, 1000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <Card className="z-10 w-full max-w-md border-none shadow-2xl">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                            <Wrench className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">GaragePro Central</CardTitle>
                        <CardDescription>Connectez-vous pour gérer votre établissement</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email professionnel</label>
                            <Input
                                type="email"
                                placeholder="nom@garage.com"
                                required
                                className="bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Mot de passe</label>
                                <button type="button" className="text-xs text-primary hover:underline">Oublié ?</button>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="bg-muted/50"
                            />
                        </div>
                        <Button className="w-full h-11" disabled={isLoading}>
                            {isLoading ? "Connexion en cours..." : (
                                <>
                                    Se connecter <ChevronRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-xs text-muted-foreground">
                        En continuant, vous acceptez nos <a href="#" className="underline">Conditions d'Utilisation</a> et notre <a href="#" className="underline">Politique de Confidentialité</a>.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
