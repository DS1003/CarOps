"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, User, Mail, Phone, MapPin, Edit, Trash2, Eye, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientModal } from "@/components/modals/client-modal";
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog";
import Link from "next/link";
import { createClient, updateClient, deleteClient } from "@/app/actions/clients";
import { useRouter } from "next/navigation";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function ClientList({ initialClients }: { initialClients: any[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredClients = initialClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAdd = () => {
        setSelectedClient(null);
        setIsModalOpen(true);
    };

    const handleEdit = (client: any) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleDelete = (client: any) => {
        setSelectedClient(client);
        setIsDeleteOpen(true);
    };

    const onSave = async (data: any) => {
        setIsLoading(true);
        if (selectedClient) {
            await updateClient(selectedClient.id, data);
        } else {
            await createClient(data);
        }
        setIsLoading(false);
        setIsModalOpen(false);
        router.refresh();
    };

    const onConfirmDelete = async () => {
        if (selectedClient) {
            setIsLoading(true);
            await deleteClient(selectedClient.id);
            setIsLoading(false);
            setIsDeleteOpen(false);
            router.refresh();
        }
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                        RV <span className="text-primary">69</span> <span className="text-gray-400 not-italic lowercase">Clients</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Répertoire central et historique de votre clientèle.</p>
                </div>
                <Button
                    onClick={handleAdd}
                    className="h-14 bg-gray-900 hover:bg-black text-white rounded-2xl gap-3 font-black px-8 transition-all hover:scale-[1.02] shadow-xl shadow-gray-200"
                >
                    <Plus className="h-5 w-5" /> NOUVEAU CLIENT
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center"
            >
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Rechercher par nom, email, téléphone, ville..."
                        className="pl-14 h-14 bg-gray-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-primary/5 focus:border-gray-200 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <span className="bg-primary/5 text-primary text-[10px] font-black px-4 py-4 rounded-xl flex items-center gap-2 uppercase tracking-widest">
                        {filteredClients.length} Clients Répertoriés
                    </span>
                </div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Client / Identité</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Coordonnées</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Localisation</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Parc Auto</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {paginatedClients.length > 0 ? (
                                    paginatedClients.map((client) => (
                                        <motion.tr
                                            variants={item}
                                            key={client.id}
                                            layout
                                            className="group hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                                        {client.name.split(" ").map((n: string) => n[0]).join("")}
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-black text-gray-900 tracking-tight">{client.name}</div>
                                                        <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5 mt-1">CLIENT-#{client.id.slice(-4).toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                        <Mail className="h-3.5 w-3.5 text-primary" />
                                                        {client.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                        <Phone className="h-3.5 w-3.5 text-primary" />
                                                        {client.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 font-bold">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{client.city}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    <Car className="h-3 w-3" />
                                                    {client._count?.vehicles || 0} VÉHICULE(S)
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-all xl:translate-x-2 xl:group-hover:translate-x-0">
                                                    <Link href={`/admin/client/${client.id}`}>
                                                        <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white hover:text-primary transition-all">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white hover:text-amber-600 transition-all" onClick={() => handleEdit(client)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white hover:text-rose-600 transition-all" onClick={() => handleDelete(client)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                                <Search className="h-8 w-8" />
                                            </div>
                                            <div className="text-gray-900 font-bold">Aucun client trouvé</div>
                                            <div className="text-sm text-gray-400">Ajustez vos filtres pour voir plus de résultats.</div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-6 border-t border-gray-50 flex items-center justify-center gap-2">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            variant="ghost"
                            className="h-10 px-4 rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                            Précédent
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-400 hover:text-gray-900'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            variant="ghost"
                            className="h-10 px-4 rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                            Suivant
                        </Button>
                    </div>
                )}
            </motion.div>

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSave}
                client={selectedClient}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={onConfirmDelete}
                title="Supprimer le client"
                description={`Êtes-vous sûr de vouloir supprimer ${selectedClient?.name} ? Toute son historique sera définitivement perdu.`}
            />
        </div>
    );
}
