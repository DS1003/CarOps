import { getClientById } from "@/app/actions/clients";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Car, ClipboardList, MapPin, Phone, Mail, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const clientResult = await getClientById(id);
    const client = clientResult.data;

    if (!client) {
        notFound();
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/admin/client">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white hover:shadow-sm">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dossier Client</h1>
                    <p className="text-gray-500 font-medium text-sm">Consultez l'historique et les véhicules de {client.name}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <User className="h-24 w-24" />
                        </div>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="h-20 w-20 rounded-[1.5rem] bg-primary/5 text-primary flex items-center justify-center text-2xl font-black shadow-inner">
                                {client.name.split(" ").map((n: string) => n[0]).join("")}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">{client.name}</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Client Fidèle</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-sm font-bold text-gray-700">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="text-sm font-bold text-gray-700">{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm font-bold text-gray-700">{client.city}, {client.address}</span>
                            </div>
                        </div>

                        <Button className="w-full mt-8 h-12 rounded-2xl bg-gray-900 hover:bg-black font-bold text-sm">
                            Modifier le profil
                        </Button>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Car className="h-5 w-5 text-primary" />
                            Statistiques
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <div className="text-xl font-black text-gray-900">{client.vehicles.length}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase">Véhicules</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                <div className="text-xl font-black text-gray-900">{client.interventions.length}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase">Visites</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Vehicles & Interventions */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-black text-gray-900">Parc Automobile</h3>
                            <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2">
                                <Plus className="h-4 w-4" /> Ajouter
                            </Button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {client.vehicles.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 font-bold text-sm">
                                    Aucun véhicule enregistré.
                                </div>
                            ) : client.vehicles.map((v: any) => (
                                <div key={v.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                                            <Car className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900">{v.brand} {v.model}</div>
                                            <div className="text-[10px] font-black text-primary uppercase tracking-widest">{v.plate}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-400 uppercase">{v.year} • {v.color}</div>
                                        <div className="text-sm font-black text-gray-700">{v.mileage} km</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h3 className="text-lg font-black text-gray-900">Historique des Interventions</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {client.interventions.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 font-bold text-sm">
                                    Aucune intervention passée.
                                </div>
                            ) : client.interventions.map((int: any) => (
                                <div key={int.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center
                                            ${int.status === 'Terminé' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <ClipboardList className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{int.type}</div>
                                            <div className="text-xs text-gray-400 font-medium">{new Date(int.dateIn).toLocaleDateString('fr-FR')}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-gray-900">{int.cost} €</div>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg
                                            ${int.status === 'Terminé' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {int.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
