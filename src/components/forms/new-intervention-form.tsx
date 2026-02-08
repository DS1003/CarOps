"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft, ArrowRight, Save, Car, Wrench,
    Calendar, FileText, Users, Search, Plus,
    CheckCircle2, Fuel, ShieldCheck, Sparkles,
    Wallet, CreditCard, Banknote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createIntervention } from "@/app/actions/interventions";
import { createClient } from "@/app/actions/clients";
import { createVehicleQuick } from "@/app/actions/vehicles";
import { cn } from "@/lib/utils";

export function NewInterventionForm({
    clients: initialClients,
    vehicles: initialVehicles,
    services: initialServices,
    preSelectedClientId
}: {
    clients: any[],
    vehicles: any[],
    services: any[],
    preSelectedClientId?: string
}) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [clients, setClients] = useState(initialClients);
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [services, setServices] = useState(initialServices);

    // Form Data
    const [formData, setFormData] = useState({
        clientId: preSelectedClientId || "",
        vehicleId: "",
        type: "Révision",
        symptoms: "",
        dateIn: new Date().toISOString().split('T')[0],
        condition: "Bon état",
        cleanliness: "Propre",
        fuelLevel: "50%",
        cost: 0,
        paymentMethod: "Espèces",
        paymentStatus: "À la livraison"
    });

    // Quick Creation States
    const [showNewClientForm, setShowNewClientForm] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", phone: "", address: "" });
    const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ brand: "", model: "", plate: "", color: "Blanche", year: new Date().getFullYear(), type: "Berline", mileage: 0 });

    // Search States
    const [clientSearch, setClientSearch] = useState("");
    const [vehicleSearch, setVehicleSearch] = useState("");

    const filteredClients = useMemo(() => {
        if (!clientSearch) return clients.slice(0, 5);
        return clients.filter(c =>
            c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
            c.phone.includes(clientSearch)
        ).slice(0, 5);
    }, [clients, clientSearch]);

    const clientVehicles = useMemo(() => {
        const ownersVehicles = vehicles.filter(v => v.ownerId === formData.clientId);
        if (!vehicleSearch) return ownersVehicles;
        return ownersVehicles.filter(v =>
            v.brand.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
            v.plate.toLowerCase().includes(vehicleSearch.toLowerCase())
        );
    }, [vehicles, formData.clientId, vehicleSearch]);

    const selectedClient = useMemo(() => clients.find(c => c.id === formData.clientId), [clients, formData.clientId]);
    const selectedVehicle = useMemo(() => vehicles.find(v => v.id === formData.vehicleId), [vehicles, formData.vehicleId]);
    const selectedServiceDetails = useMemo(() => services.find(s => s.name === formData.type), [services, formData.type]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleQuickClientCreate = async () => {
        setIsLoading(true);
        const result = await createClient({ ...newClient, city: "Dakar", email: "" });
        if (result.success) {
            setClients([result.data, ...clients]);
            setFormData({ ...formData, clientId: result.data.id });
            setShowNewClientForm(false);
        } else {
            alert(result.error);
        }
        setIsLoading(false);
    };

    const handleQuickVehicleCreate = async () => {
        setIsLoading(true);
        const result = await createVehicleQuick({ ...newVehicle, ownerId: formData.clientId });
        if (result.success) {
            setVehicles([result.data, ...vehicles]);
            setFormData({ ...formData, vehicleId: result.data.id });
            setShowNewVehicleForm(false);
        } else {
            alert(result.error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const result = await createIntervention(formData);
        if (result.success) {
            const path = window.location.pathname;
            router.push(path.includes("/admin") ? "/admin/intervention" : "/reception");
        } else {
            alert(result.error);
            setIsLoading(false);
        }
    };

    const steps = [
        { id: 1, label: "Client", icon: Users },
        { id: 2, label: "Véhicule", icon: Car },
        { id: 3, label: "Services", icon: Wrench },
        { id: 4, label: "Paiement", icon: Wallet },
    ];

    return (
        <div className="w-full space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <Button
                        variant="outline"
                        onClick={() => step > 1 ? handleBack() : router.back()}
                        className="h-12 w-12 rounded-2xl border-gray-100 hover:bg-gray-50 text-gray-400 group transition-all"
                    >
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1.5 w-6 bg-red-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600/50">Atelier Expertise</span>
                        </div>
                        <h1 className="text-4xl font-light text-gray-900 tracking-tight">
                            Nouvelle <span className="font-black italic text-gray-900">Intervention</span>
                        </h1>
                    </div>
                </div>

                {/* Refined Stepper */}
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-xl p-2 rounded-[2rem] border border-gray-100/50 shadow-sm self-start">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className={cn(
                                "h-12 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500",
                                step === s.id ? "bg-gray-900 text-white shadow-xl shadow-gray-200" :
                                    step > s.id ? "bg-red-50 text-red-600" : "bg-transparent text-gray-300"
                            )}>
                                <s.icon className={cn("h-4 w-4", step === s.id ? "animate-pulse" : "")} />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", step === s.id ? "block" : "hidden md:block")}>
                                    {s.label}
                                </span>
                                {step > s.id && <CheckCircle2 className="h-3 w-3" />}
                            </div>
                            {i < steps.length - 1 && <div className="w-4 h-[1px] bg-gray-100 mx-1" />}
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* STEP 1: CLIENT */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="grid lg:grid-cols-4 gap-8"
                    >
                        {/* Info Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm h-full">
                                <div className="h-14 w-14 bg-red-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-red-200">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 uppercase italic">Identité <br />du Client</h3>
                                <p className="text-sm font-medium text-gray-400 leading-relaxed">
                                    Sélectionnez un membre de votre base de données ou créez un nouveau profil en un clic pour démarrer l'intervention.
                                </p>
                            </div>
                        </div>

                        {/* Search & Selection */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-8 md:p-12 h-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                    <h2 className="text-sm font-black text-gray-900 tracking-tighter uppercase ml-1">Répertoire Client</h2>
                                    {!showNewClientForm && (
                                        <Button
                                            onClick={() => setShowNewClientForm(true)}
                                            variant="outline"
                                            className="h-12 rounded-2xl border-dashed border-2 px-8 hover:border-red-600 hover:text-red-600 transition-all gap-2"
                                        >
                                            <Plus className="h-4 w-4" /> Ajouter un client
                                        </Button>
                                    )}
                                </div>

                                {showNewClientForm ? (
                                    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom Complet <span className="text-red-600 text-[12px]">*</span></p>
                                            <Input value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} placeholder="ex: Mohamadou Sy" className="h-16 px-6 font-bold rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone <span className="text-red-600 text-[12px]">*</span></p>
                                            <Input value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} placeholder="77 000 00 00" className="h-16 px-6 font-bold rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner" />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adresse de résidence (Optionnel)</p>
                                            <Input value={newClient.address} onChange={e => setNewClient({ ...newClient, address: e.target.value })} placeholder="Dakar Plateau, Immeuble..." className="h-16 px-6 font-bold rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner" />
                                        </div>
                                        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                                            <Button variant="ghost" onClick={() => setShowNewClientForm(false)} className="h-14 font-bold text-gray-400">Annuler</Button>
                                            <Button onClick={handleQuickClientCreate} disabled={isLoading} className="h-14 px-12 bg-red-600 hover:bg-black text-white rounded-2xl font-black shadow-lg shadow-red-100 transition-all">
                                                {isLoading ? "Synchronisation..." : "Valider & Choisir"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="relative group">
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-6 w-6 group-focus-within:text-red-600 transition-colors" />
                                            <Input
                                                value={clientSearch}
                                                onChange={e => setClientSearch(e.target.value)}
                                                placeholder="Saisir un nom ou un numéro..."
                                                className="h-20 pl-16 rounded-[1.5rem] bg-gray-50/50 border-none font-bold text-xl placeholder:text-gray-200 focus:ring-2 focus:ring-red-600/10 transition-all"
                                            />
                                        </div>

                                        <div className="grid gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                            {filteredClients.map(client => (
                                                <button
                                                    key={client.id}
                                                    onClick={() => setFormData({ ...formData, clientId: client.id })}
                                                    className={cn(
                                                        "flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300",
                                                        formData.clientId === client.id
                                                            ? "border-red-600 bg-red-50/20 shadow-xl shadow-red-100/20"
                                                            : "border-gray-50 bg-gray-50/20 hover:border-gray-200 hover:bg-white"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={cn(
                                                            "h-14 w-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-sm",
                                                            formData.clientId === client.id ? "bg-red-600 text-white" : "bg-white text-gray-400 border border-gray-100"
                                                        )}>
                                                            {client.name[0]}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-black text-gray-900 tracking-tight">{client.name}</div>
                                                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-0.5">{client.phone}</div>
                                                        </div>
                                                    </div>
                                                    {formData.clientId === client.id && <CheckCircle2 className="h-6 w-6 text-red-600 animate-in zoom-in duration-300" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
                                    <Button
                                        disabled={!formData.clientId || showNewClientForm}
                                        onClick={handleNext}
                                        className="h-16 px-12 bg-gray-900 hover:bg-red-600 text-white rounded-2xl font-black gap-4 transition-all hover:scale-[1.02] shadow-xl shadow-gray-200"
                                    >
                                        Continuer <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: VEHICLE + AUDIT */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 md:p-12">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Véhicule & Audit Entrée</h2>
                                    <p className="text-gray-400 font-bold text-sm">Client : {selectedClient?.name}</p>
                                </div>
                                {!showNewVehicleForm && (
                                    <Button onClick={() => setShowNewVehicleForm(true)} variant="outline" className="rounded-xl border-dashed border-2 hover:border-red-600 hover:text-red-600 gap-2">
                                        <Plus className="h-4 w-4" /> Nouveau Véhicule
                                    </Button>
                                )}
                            </div>

                            {showNewVehicleForm ? (
                                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Marque & Modèle <span className="text-red-500 lowercase font-bold">(Obligatoire)</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <Input value={newVehicle.brand} onChange={e => setNewVehicle({ ...newVehicle, brand: e.target.value })} placeholder="Toyota" className="h-14 font-bold rounded-2xl" />
                                            <Input value={newVehicle.model} onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })} placeholder="Hilux" className="h-14 font-bold rounded-2xl" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Plaque <span className="text-red-500 lowercase font-bold">(Obligatoire)</span>
                                        </label>
                                        <Input value={newVehicle.plate} onChange={e => setNewVehicle({ ...newVehicle, plate: e.target.value })} placeholder="AA 123 BB" className="h-14 font-bold rounded-2xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Kilométrage <span className="text-gray-300 lowercase font-bold">(Optionnel)</span>
                                        </label>
                                        <Input type="number" value={newVehicle.mileage} onChange={e => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) })} placeholder="125 000" className="h-14 font-bold rounded-2xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Couleur <span className="text-gray-300 lowercase font-bold">(Optionnel)</span>
                                        </label>
                                        <Input value={newVehicle.color} onChange={e => setNewVehicle({ ...newVehicle, color: e.target.value })} placeholder="Blanche" className="h-14 font-bold rounded-2xl" />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                        <Button variant="ghost" onClick={() => setShowNewVehicleForm(false)}>Annuler</Button>
                                        <Button onClick={handleQuickVehicleCreate} disabled={isLoading} className="bg-red-600 text-white rounded-xl px-8 font-black">
                                            {isLoading ? "Création..." : "Enregistrer & Sélectionner"}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Vehicle Selection List */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {clientVehicles.map(vehicle => (
                                            <button
                                                key={vehicle.id}
                                                onClick={() => setFormData({ ...formData, vehicleId: vehicle.id })}
                                                className={cn(
                                                    "flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all",
                                                    formData.vehicleId === vehicle.id
                                                        ? "border-red-600 bg-red-50/50"
                                                        : "border-gray-50 bg-gray-50/30"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-12 w-12 rounded-xl flex items-center justify-center font-black",
                                                    formData.vehicleId === vehicle.id ? "bg-red-600 text-white" : "bg-white text-gray-400 border border-gray-100"
                                                )}>
                                                    <Car className="h-6 w-6" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-black text-gray-900 uppercase italic">{vehicle.brand} {vehicle.model}</div>
                                                    <div className="text-xs font-black text-red-600 uppercase tracking-tighter">{vehicle.plate}</div>
                                                </div>
                                            </button>
                                        ))}
                                        {clientVehicles.length === 0 && !showNewVehicleForm && (
                                            <div className="md:col-span-2 py-8 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                                <p className="text-gray-400 font-bold">Aucun véhicule enregistré pour ce client.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Entry Audit Section */}
                                    {formData.vehicleId && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-8 border-t border-gray-50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ShieldCheck className="h-5 w-5 text-red-600" />
                                                <h3 className="text-lg font-black text-gray-900 italic uppercase">Audit à l'entrée</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Condition */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Car className="h-3 w-3" /> État Général
                                                    </label>
                                                    <div className="flex p-1 bg-gray-100 rounded-xl">
                                                        {["Mauvais", "Moyen", "Bon état"].map(opt => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => setFormData({ ...formData, condition: opt })}
                                                                className={cn(
                                                                    "flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                                                                    formData.condition === opt ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                                                                )}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Cleanliness */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Sparkles className="h-3 w-3" /> Propreté
                                                    </label>
                                                    <div className="flex p-1 bg-gray-100 rounded-xl">
                                                        {["Sale", "Passable", "Propre"].map(opt => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => setFormData({ ...formData, cleanliness: opt })}
                                                                className={cn(
                                                                    "flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                                                                    formData.cleanliness === opt ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                                                                )}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Fuel */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Fuel className="h-3 w-3" /> Carburant
                                                    </label>
                                                    <div className="flex p-1 bg-gray-100 rounded-xl">
                                                        {["Réserve", "50%", "Plein"].map(opt => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => setFormData({ ...formData, fuelLevel: opt })}
                                                                className={cn(
                                                                    "flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                                                                    formData.fuelLevel === opt ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                                                                )}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            <div className="mt-12 flex justify-between">
                                <Button variant="ghost" onClick={handleBack} className="font-bold">Précédent</Button>
                                <Button
                                    disabled={!formData.vehicleId || showNewVehicleForm}
                                    onClick={handleNext}
                                    className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black gap-2 transition-all hover:scale-105"
                                >
                                    Suivant <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: SERVICES */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 md:p-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">Service & Demande Client</h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                            Sélectionner un Service <span className="text-red-500 lowercase font-bold">(Obligatoire)</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto p-1 pr-2 no-scrollbar">
                                            {services.map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        type: s.name,
                                                        cost: s.price
                                                    })}
                                                    className={cn(
                                                        "p-4 rounded-2xl border-2 text-left transition-all",
                                                        formData.type === s.name ? "border-red-600 bg-red-50" : "border-gray-50 bg-gray-50/50"
                                                    )}
                                                >
                                                    <div className={cn("text-[10px] font-black uppercase tracking-widest", formData.type === s.name ? "text-red-600" : "text-gray-400")}>{s.category}</div>
                                                    <div className="font-black text-gray-900 text-xs mt-1">{s.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-500 mt-2 flex justify-between">
                                                        <span>{s.price.toLocaleString()} FCFA</span>
                                                        <span>{s.duration}</span>
                                                    </div>
                                                </button>
                                            ))}
                                            {services.length === 0 && (
                                                <div className="col-span-2 text-center py-8 text-gray-400 font-bold text-sm bg-gray-50 rounded-2xl">
                                                    Aucun service configuré.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                            Estimation du coût <span className="text-gray-300 lowercase font-bold">(Optionnel)</span>
                                        </label>
                                        <div className="relative">
                                            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                type="number"
                                                value={formData.cost}
                                                onChange={e => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                                                placeholder="0.00 FCFA"
                                                className="h-14 pl-12 font-black text-lg rounded-2xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                            Symptômes & Remarques <span className="text-red-500 lowercase font-bold">(Obligatoire)</span>
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-5 text-gray-400 h-5 w-5" />
                                            <textarea
                                                value={formData.symptoms}
                                                onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                                                placeholder="Décrire les problèmes rapportés par le client..."
                                                className="w-full min-h-[220px] pl-12 p-5 rounded-2xl bg-gray-50/50 border-gray-100 font-bold focus:bg-white transition-all outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-between">
                                <Button variant="ghost" onClick={handleBack} className="font-bold">Précédent</Button>
                                <Button
                                    disabled={!formData.symptoms}
                                    onClick={handleNext}
                                    className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black gap-2 transition-all hover:scale-105"
                                >
                                    Suivant <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: PAYMENT & SUMMARY */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Summary Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 md:p-10">
                                    <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4 italic uppercase">Récapitulatif Dossier</h2>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</div>
                                                    <div className="font-black text-lg text-gray-900">{selectedClient?.name}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                                                    <Car className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Véhicule</div>
                                                    <div className="font-black text-lg text-gray-900 uppercase italic">{selectedVehicle?.brand} {selectedVehicle?.model}</div>
                                                    <div className="text-xs font-black text-red-600 tracking-tighter">{selectedVehicle?.plate}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Audit Entrée</div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                                                    <div className="text-[8px] font-black text-gray-400 uppercase mb-1">État</div>
                                                    <div className="text-[10px] font-black text-gray-900">{formData.condition}</div>
                                                </div>
                                                <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                                                    <div className="text-[8px] font-black text-gray-400 uppercase mb-1">Propreté</div>
                                                    <div className="text-[10px] font-black text-gray-900">{formData.cleanliness}</div>
                                                </div>
                                                <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                                                    <div className="text-[8px] font-black text-gray-400 uppercase mb-1">Carburant</div>
                                                    <div className="text-[10px] font-black text-gray-900">{formData.fuelLevel}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-gray-900 rounded-3xl text-white">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type de service</div>
                                                <div className="text-xl font-black italic uppercase">{formData.type} {selectedServiceDetails && <span className="text-sm not-italic opacity-50 ml-2">({selectedServiceDetails.duration})</span>}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Estimé</div>
                                                <div className="text-2xl font-black text-red-500">{formData.cost.toLocaleString()} FCFA</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Column */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8">
                                    <h3 className="text-xl font-black text-gray-900 mb-6">Paiement</h3>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                Moment du règlement <span className="text-red-500 lowercase font-bold">(Obligatoire)</span>
                                            </label>
                                            <div className="flex p-1 bg-gray-100 rounded-2xl">
                                                {["Encaisser maintenant", "À la livraison"].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setFormData({ ...formData, paymentStatus: opt })}
                                                        className={cn(
                                                            "flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all",
                                                            formData.paymentStatus === opt ? "bg-white text-gray-900 shadow-md" : "text-gray-400"
                                                        )}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                Mode de règlement <span className="text-red-500 lowercase font-bold">(Obligatoire)</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { id: "Espèces", icon: Banknote },
                                                    { id: "Wave", icon: Wallet },
                                                    { id: "Orange Money", icon: Wallet },
                                                    { id: "Card", icon: CreditCard }
                                                ].map(m => (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                                                        className={cn(
                                                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                                            formData.paymentMethod === m.id ? "border-red-600 bg-red-50 text-red-600" : "border-gray-50 bg-gray-50/50 text-gray-400 grayscale"
                                                        )}
                                                    >
                                                        <m.icon className="h-5 w-5" />
                                                        <span className="text-[8px] font-black uppercase">{m.id}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="w-full h-16 mt-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg gap-3 shadow-xl shadow-red-200"
                                    >
                                        <Save className="h-6 w-6" />
                                        {isLoading ? "Enregistrement..." : "Valider l'entrée"}
                                    </Button>

                                    <Button variant="ghost" onClick={handleBack} className="w-full mt-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                                        Corriger des informations
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
