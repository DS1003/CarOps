"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, Car, User, Calendar, Gauge, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleModal } from "@/components/modals/vehicle-modal";
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog";
import Link from "next/link";
import { createVehicle, updateVehicle, deleteVehicle } from "@/app/actions/vehicles";
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

export function VehicleList({ initialVehicles }: { initialVehicles: any[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const filteredVehicles = initialVehicles.filter(v =>
        v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setSelectedVehicle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (vehicle: any) => {
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleDelete = (vehicle: any) => {
        setSelectedVehicle(vehicle);
        setIsDeleteOpen(true);
    };

    const onSave = async (formData: FormData) => {
        setIsLoading(true);
        if (selectedVehicle) {
            await updateVehicle(selectedVehicle.id, formData);
        } else {
            await createVehicle(formData);
        }
        setIsLoading(false);
        setIsModalOpen(false);
        router.refresh();
    };

    const onConfirmDelete = async () => {
        if (selectedVehicle) {
            setIsLoading(true);
            await deleteVehicle(selectedVehicle.id);
            setIsLoading(false);
            setIsDeleteOpen(false);
            router.refresh();
        }
    };

    return (
        <div className="space-y-10">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Véhicules</h1>
                    <p className="text-gray-500 font-medium">Consultez et gérez le parc automobile du garage.</p>
                </div>
                <Button
                    onClick={handleAdd}
                    className="h-12 bg-primary hover:bg-primary/90 shadow-sm rounded-xl gap-2 font-bold transition-all px-6"
                >
                    <Plus className="h-5 w-5" /> Enregistrer un Véhicule
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2 items-center"
            >
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Chercher par plaque, marque ou modèle..."
                        className="pl-11 h-12 bg-gray-50/50 border-transparent rounded-xl focus:bg-white focus:shadow-sm focus:border-gray-200 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="ghost" className="h-12 px-5 rounded-xl text-gray-400 hover:text-gray-900 font-bold gap-2">
                    <Filter className="h-4 w-4" /> Filtres
                </Button>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Véhicule</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Immatriculation</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Propriétaire</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Kilométrage</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredVehicles.map((vehicle) => (
                                <motion.tr
                                    variants={item}
                                    key={vehicle.id}
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                                                {vehicle.imageUrl ? (
                                                    <img src={vehicle.imageUrl} alt={vehicle.brand} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Car className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{vehicle.brand} {vehicle.model}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{vehicle.type} • {vehicle.year}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-100 text-xs font-black uppercase tracking-wider text-gray-700 shadow-sm">
                                            {vehicle.plate}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {vehicle.owner?.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{vehicle.owner?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-600">
                                        {vehicle.mileage.toLocaleString()} km
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <Link href={`/admin/vehicule/${vehicle.id}`}>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:text-primary transition-all">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:text-amber-600 transition-all" onClick={() => handleEdit(vehicle)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:text-rose-600 transition-all" onClick={() => handleDelete(vehicle)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <VehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSave}
                vehicle={selectedVehicle}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={onConfirmDelete}
                title="Supprimer le véhicule"
                description={`L'action supprimera définitivement le véhicule ${selectedVehicle?.brand} ${selectedVehicle?.model} (${selectedVehicle?.plate}).`}
            />
        </div>
    );
}
