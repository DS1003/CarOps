"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SECRETAIRE_NAVIGATION } from "@/data/navigation";
import { ReactNode } from "react";

export default function SecretaireLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar items={SECRETAIRE_NAVIGATION} title="RV 69 Secrétariat" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header appName="RV 69" role="Secrétaire" />
                <main className="flex-1 overflow-y-auto bg-muted/20 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
