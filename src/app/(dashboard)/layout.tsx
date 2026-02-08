import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-8 bg-muted/20">
                    {children}
                </main>
            </div>
        </div>
    );
}
