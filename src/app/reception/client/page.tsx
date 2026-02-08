import { getClients } from "@/app/actions/clients";
import { Search, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function ReceptionClientsPage() {
    const result = await getClients();
    const clients = result.success ? result.data : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1200px] mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Clients</h1>
                    <p className="text-gray-500 font-medium">Recherchez ou créez des fiches clients à l'accueil.</p>
                </div>
                <Link href="/reception/client/nouveau">
                    <Button className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/20 h-12 px-6 rounded-xl font-bold">
                        <Plus className="h-5 w-5" /> Ajouter un Client
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Nom, téléphone, adresse..."
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Client</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Téléphone</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Adresse</th>
                            <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {clients.map((client: any) => (
                            <tr key={client.id} className="group hover:bg-gray-50/30 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold uppercase">
                                            {client.name[0]}
                                        </div>
                                        <div className="font-bold text-gray-900">{client.name}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-gray-600 font-medium">{client.phone}</td>
                                <td className="px-8 py-6 text-sm text-gray-600 font-medium truncate max-w-[200px]">{client.address}</td>
                                <td className="px-8 py-6 text-right">
                                    <Link href={`/reception/intervention/nouveau?clientId=${client.id}`}>
                                        <Button variant="ghost" className="h-10 px-4 rounded-xl hover:bg-primary/5 hover:text-primary font-bold gap-2">
                                            Nouvelle intervention <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
