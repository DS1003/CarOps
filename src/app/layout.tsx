import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "RV 69 | Vente - Achat - Entretien Auto Moto",
    description: "Solution premium pour la gestion complète de votre établissement automobile RV 69.",
};


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="fr" className="h-full">
            <body className={`${inter.className} h-full overflow-hidden`}>
                {children}
            </body>
        </html>
    );
}
