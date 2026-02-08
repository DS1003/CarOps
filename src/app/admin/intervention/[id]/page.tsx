import { getInterventionById } from "@/app/actions/interventions";
import {
    Wrench, User, Car,
    CheckCircle2, Printer,
    ChevronLeft, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function InterventionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getInterventionById(id);

    if (!result.success || !result.data) {
        return notFound();
    }

    const intervention = result.data;
    const client = intervention.client;
    const vehicle = intervention.vehicle;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Terminé": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "En cours": return "bg-blue-50 text-blue-700 border-blue-200";
            case "En attente": return "bg-amber-50 text-amber-700 border-amber-200";
            case "Facturée": return "bg-purple-50 text-purple-700 border-purple-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20 p-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/intervention" className="h-12 w-12 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Intervention {intervention.customId || intervention.id.slice(0, 8)}</h1>
                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusStyle(intervention.status)}`}>
                                {intervention.status}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium">Créée le {new Date(intervention.dateIn).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 gap-2 font-bold hover:bg-gray-50">
                        <Printer className="h-5 w-5" /> Imprimer
                    </Button>
                    <Button className="bg-primary text-white gap-2 shadow-lg shadow-primary/20 h-12 px-6 rounded-xl transition-all hover:scale-[1.02]">
                        <CheckCircle2 className="h-5 w-5" /> Terminer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-xl font-black">
                                {client.name[0]}
                            </div>
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Client</div>
                                <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm py-3 border-b border-gray-50">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Téléphone</span>
                                <span className="text-gray-900 font-bold">{client.phone}</span>
                            </div>
                            <Button variant="outline" className="w-full mt-4 h-11 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                                Voir profil complet
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
                                <Car className="h-7 w-7" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Véhicule</div>
                                <h3 className="text-lg font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
                                <div className="text-xs font-black text-primary uppercase mt-0.5 tracking-tighter">{vehicle.plate}</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm py-3 border-b border-gray-50">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Année</span>
                                <span className="text-gray-900 font-bold">{vehicle.year}</span>
                            </div>
                            <div className="flex justify-between text-sm py-3 border-b border-gray-50">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Km</span>
                                <span className="text-gray-900 font-bold">{vehicle.mileage?.toLocaleString()} km</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[.2em] mb-4">Symptômes Client</h3>
                        <p className="text-gray-900 font-medium leading-relaxed bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                            "{intervention.symptoms}"
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900">Services & Pièces</h2>
                        </div>
                        <div className="p-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                                        <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Prix</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr className="bg-gray-50/50">
                                        <td colSpan={2} className="px-8 py-8 text-center text-gray-400 italic">
                                            Aucun article ajouté pour le moment.
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-900 text-white">
                                        <td className="px-8 py-6 text-sm font-black uppercase tracking-widest">Coût estimé total (HT)</td>
                                        <td className="px-8 py-6 text-right text-2xl font-black">0.00 €</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
