"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Shield, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser, deleteUser } from "@/app/actions/users";
import { useRouter } from "next/navigation";

export function UserList({ initialUsers }: { initialUsers: any[] }) {
    const router = useRouter();
    const [isAddMode, setIsAddMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Atelier",
    });

    const roles = ["Admin", "Réception", "Secrétariat", "Atelier"];

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await createUser(formData);
        if (result.success) {
            setIsAddMode(false);
            setFormData({ name: "", email: "", role: "Atelier" });
            router.refresh();
        } else {
            alert(result.error);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer cet utilisateur ?")) {
            await deleteUser(id);
            router.refresh();
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Gestion Équipe</h1>
                    <p className="text-gray-500 font-medium">Comptes utilisateurs et droits d'accès.</p>
                </div>
                <Button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/10 h-12 px-6 rounded-xl transition-all"
                >
                    <Plus className="h-5 w-5" /> Nouvel Utilisateur
                </Button>
            </div>

            {isAddMode && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100"
                >
                    <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom Complet</label>
                            <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jean Dupont" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                            <Input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="contact@rv69.fr" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Rôle</label>
                            <select
                                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAddMode(false)}>Annuler</Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary px-8">{isLoading ? "..." : "Confirmer"}</Button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-50">
                    {initialUsers.length === 0 ? (
                        <div className="p-20 text-center text-gray-400 font-bold">Aucun utilisateur enregistré.</div>
                    ) : initialUsers.map((user, index) => (
                        <div
                            key={user.id}
                            className="p-6 md:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold
                                    ${user.role === 'Admin' ? 'bg-purple-50 text-purple-600' :
                                        user.role === 'Réception' ? 'bg-blue-50 text-blue-600' :
                                            user.role === 'Secrétariat' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}
                                >
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Shield className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-bold text-gray-900">{user.email}</div>
                                    <div className="flex items-center justify-end gap-1.5 mt-1">
                                        <div className={`h-1.5 w-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                        <span className={`text-xs font-bold ${user.active ? 'text-emerald-600' : 'text-gray-400'}`}>
                                            {user.active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(user.id)}
                                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
