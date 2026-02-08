"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft, ArrowRight, Save, Car, Wrench,
    Calendar, FileText, Users, Search, Plus,
    CheckCircle2, Fuel, ShieldCheck, Sparkles,
    Wallet, CreditCard, Banknote, Package, Trash2
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
    products: initialProducts,
    preSelectedClientId
}: {
    clients: any[],
    vehicles: any[],
    services: any[],
    products: any[],
    preSelectedClientId?: string
}) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [clients, setClients] = useState(initialClients);
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [services, setServices] = useState(initialServices);
    const [products, setProducts] = useState(initialProducts);

    // Form Data
    const [formData, setFormData] = useState({
        clientId: preSelectedClientId || "",
        vehicleId: "",
        selectedServices: [] as string[],
        addedProducts: [] as { id: string, name: string, price: number, quantity: number }[],
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
    const [productSearch, setProductSearch] = useState("");

    const filteredProducts = useMemo(() => {
        if (!productSearch) return products;
        return products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
    }, [products, productSearch]);

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

    const selectedServicesData = useMemo(() =>
        services.filter(s => formData.selectedServices.includes(s.name)),
        [services, formData.selectedServices]
    );

    const totalCost = useMemo(() => {
        const servicesTotal = selectedServicesData.reduce((acc, s) => acc + s.price, 0);
        const productsTotal = formData.addedProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);
        return servicesTotal + productsTotal;
    }, [selectedServicesData, formData.addedProducts]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const toggleService = (serviceName: string, price: number) => {
        setFormData(prev => {
            const isSelected = prev.selectedServices.includes(serviceName);
            if (isSelected) {
                return { ...prev, selectedServices: prev.selectedServices.filter(s => s !== serviceName) };
            } else {
                return { ...prev, selectedServices: [...prev.selectedServices, serviceName] };
            }
        });
    };

    const addProduct = (product: any) => {
        setFormData(prev => {
            const existing = prev.addedProducts.find(p => p.id === product.id);
            if (existing) {
                return {
                    ...prev,
                    addedProducts: prev.addedProducts.map(p =>
                        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                    )
                };
            }
            return {
                ...prev,
                addedProducts: [...prev.addedProducts, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
            };
        });
    };

    const removeProduct = (id: string) => {
        setFormData(prev => ({
            ...prev,
            addedProducts: prev.addedProducts.filter(p => p.id !== id)
        }));
    };

    const updateProductQty = (id: string, delta: number) => {
        setFormData(prev => ({
            ...prev,
            addedProducts: prev.addedProducts.map(p =>
                p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
            )
        }));
    };

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
        const result = await createIntervention({
            ...formData,
            cost: totalCost
        });
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

                {/* STEP 2: VEHICLE & AUDIT */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="grid lg:grid-cols-4 gap-8"
                    >
                        {/* Info Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm h-full">
                                <div className="h-14 w-14 bg-red-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-red-200">
                                    <Car className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 uppercase italic">Véhicule <br />& Audit</h3>
                                <p className="text-sm font-medium text-gray-400 leading-relaxed">
                                    Identifiez le véhicule concerné et effectuez un audit rapide de son état à la réception pour garantir une transparence totale.
                                </p>

                                <div className="mt-12 space-y-4">
                                    <div className="p-4 rounded-2xl bg-gray-900/5 border border-gray-900/5">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Propriétaire</div>
                                        <div className="font-black text-gray-900 tracking-tight">{selectedClient?.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search & Audit */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-8 md:p-12">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                    <h2 className="text-sm font-black text-gray-900 tracking-tighter uppercase ml-1">Répertoire Véhicule</h2>
                                    {!showNewVehicleForm && (
                                        <Button
                                            onClick={() => setShowNewVehicleForm(true)}
                                            variant="outline"
                                            className="h-12 rounded-2xl border-dashed border-2 px-8 hover:border-red-600 hover:text-red-600 transition-all gap-2"
                                        >
                                            <Plus className="h-4 w-4" /> Ajouter un véhicule
                                        </Button>
                                    )}
                                </div>

                                {showNewVehicleForm ? (
                                    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Marque & Modèle <span className="text-red-600 text-[12px]">*</span></p>
                                            <div className="flex gap-3">
                                                <Input value={newVehicle.brand} onChange={e => setNewVehicle({ ...newVehicle, brand: e.target.value })} placeholder="Toyota" className="h-16 px-6 font-bold rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner" />
                                                <Input value={newVehicle.model} onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })} placeholder="Hilux" className="h-16 px-6 font-bold rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Immatriculation <span className="text-red-600 text-[12px]">*</span></p>
                                            <Input value={newVehicle.plate} onChange={e => setNewVehicle({ ...newVehicle, plate: e.target.value })} placeholder="AA 123 BB" className="h-16 px-6 font-bold rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kilométrage (Optionnel)</p>
                                            <Input type="number" value={newVehicle.mileage} onChange={e => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) })} placeholder="125 000" className="h-16 px-6 font-bold rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Couleur (Optionnel)</p>
                                            <Input value={newVehicle.color} onChange={e => setNewVehicle({ ...newVehicle, color: e.target.value })} placeholder="Blanche" className="h-16 px-6 font-bold rounded-2xl bg-gray-50/50 border-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner" />
                                        </div>
                                        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                                            <Button variant="ghost" onClick={() => setShowNewVehicleForm(false)} className="h-14 font-bold text-gray-400">Annuler</Button>
                                            <Button onClick={handleQuickVehicleCreate} disabled={isLoading} className="h-14 px-12 bg-red-600 hover:bg-black text-white rounded-2xl font-black shadow-lg shadow-red-100 transition-all">
                                                {isLoading ? "Synchronisation..." : "Valider le véhicule"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="relative group">
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-6 w-6 group-focus-within:text-red-600 transition-colors" />
                                            <Input
                                                value={vehicleSearch}
                                                onChange={e => setVehicleSearch(e.target.value)}
                                                placeholder="Rechercher une plaque ou un modèle..."
                                                className="h-20 pl-16 rounded-[1.5rem] bg-gray-50/50 border-none font-bold text-xl placeholder:text-gray-200 focus:ring-2 focus:ring-red-600/10 transition-all"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            {clientVehicles.map(v => (
                                                <button
                                                    key={v.id}
                                                    onClick={() => setFormData({ ...formData, vehicleId: v.id })}
                                                    className={cn(
                                                        "flex items-center gap-6 p-6 rounded-[2rem] border transition-all duration-300",
                                                        formData.vehicleId === v.id
                                                            ? "border-red-600 bg-red-50/20 shadow-xl shadow-red-100/20"
                                                            : "border-gray-50 bg-gray-50/20 hover:border-gray-200 hover:bg-white"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-16 w-16 rounded-[1.25rem] flex flex-col items-center justify-center transition-all shadow-sm",
                                                        formData.vehicleId === v.id ? "bg-red-600 text-white" : "bg-white text-gray-400 border border-gray-100"
                                                    )}>
                                                        <Car className="h-6 w-6 mb-1" />
                                                        <span className="text-[8px] font-black uppercase">VHL</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="font-black text-gray-900 tracking-tight uppercase italic">{v.brand} {v.model}</div>
                                                        <div className="inline-block px-3 py-1 bg-gray-900 text-white text-[10px] font-black rounded-lg mt-2 tracking-widest italic">{v.plate}</div>
                                                    </div>
                                                    {formData.vehicleId === v.id && <CheckCircle2 className="h-6 w-6 text-red-600 ml-auto animate-in zoom-in duration-300" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Audit section */}
                            {formData.vehicleId && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-8 md:p-12"
                                >
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-sm">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-sm font-black text-gray-900 tracking-tighter uppercase">Expertise Réception</h2>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">État de la Carrosserie</label>
                                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-50 rounded-2xl">
                                                {["Bon état", "Endommagé"].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setFormData({ ...formData, condition: opt })}
                                                        className={cn(
                                                            "py-4 text-[10px] font-black uppercase rounded-xl transition-all",
                                                            formData.condition === opt ? "bg-gray-900 text-white shadow-xl shadow-gray-200" : "text-gray-400 hover:text-gray-600"
                                                        )}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Niveau de Propreté</label>
                                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-50 rounded-2xl">
                                                {["Propre", "Sale"].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setFormData({ ...formData, cleanliness: opt })}
                                                        className={cn(
                                                            "py-4 text-[10px] font-black uppercase rounded-xl transition-all",
                                                            formData.cleanliness === opt ? "bg-gray-900 text-white shadow-xl shadow-gray-200" : "text-gray-400 hover:text-gray-600"
                                                        )}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantité Carburant</label>
                                            <div className="grid grid-cols-4 gap-1 p-1.5 bg-gray-50 rounded-2xl">
                                                {["0%", "25%", "50%", "100%"].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setFormData({ ...formData, fuelLevel: opt })}
                                                        className={cn(
                                                            "py-4 text-[10px] font-black uppercase rounded-xl transition-all flex items-center justify-center",
                                                            formData.fuelLevel === opt ? "bg-red-600 text-white shadow-xl shadow-red-100" : "text-gray-400 hover:text-gray-600"
                                                        )}
                                                    >
                                                        {opt === "0%" ? "R" : opt === "100%" ? "P" : opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between">
                                        <Button variant="ghost" onClick={handleBack} className="h-16 px-8 font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">Précédent</Button>
                                        <Button
                                            disabled={!formData.vehicleId || showNewVehicleForm}
                                            onClick={handleNext}
                                            className="h-16 px-12 bg-gray-900 hover:bg-red-600 text-white rounded-2xl font-black gap-4 transition-all hover:scale-[1.02] shadow-xl shadow-gray-200"
                                        >
                                            Continuer <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: SERVICES & PIÈCES */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="grid lg:grid-cols-4 gap-8"
                    >
                        {/* Info & Recap Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm h-full flex flex-col">
                                <div className="h-14 w-14 bg-red-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-red-200">
                                    <Wrench className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 uppercase italic">Prestations <br />& Pièces</h3>
                                <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8">
                                    Composez l'intervention en sélectionnant les services requis et en ajoutant les pièces détachées nécessaires.
                                </p>

                                <div className="mt-auto space-y-6">
                                    <div className="p-6 rounded-[2rem] bg-gray-900 text-white shadow-2xl shadow-gray-200">
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Estimé</div>
                                        <div className="text-3xl font-black tracking-tighter">{totalCost.toLocaleString()} <span className="text-sm font-light opacity-50">FCFA</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selection Area */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-8 md:p-12">
                                <h2 className="text-sm font-black text-gray-900 tracking-tighter uppercase ml-1 mb-8">Catalogue des Services <span className="text-red-600 text-[12px]">*</span></h2>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2 p-1">
                                    {services.map(s => {
                                        const isSelected = formData.selectedServices.includes(s.name);
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => toggleService(s.name, s.price)}
                                                className={cn(
                                                    "p-6 rounded-[2rem] border-2 text-left transition-all relative group",
                                                    isSelected ? "border-red-600 bg-red-50/20 shadow-xl shadow-red-100/20" : "border-gray-50 bg-gray-50/20 hover:border-gray-200 hover:bg-white"
                                                )}
                                            >
                                                <div className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest mb-2 transition-colors",
                                                    isSelected ? "text-red-600" : "text-gray-400"
                                                )}>
                                                    {s.category}
                                                </div>
                                                <div className="font-black text-gray-900 text-xs tracking-tight">{s.name}</div>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-gray-400">{s.price.toLocaleString()} FCFA</span>
                                                    {isSelected && <CheckCircle2 className="h-5 w-5 text-red-600 animate-in zoom-in" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Product Search */}
                                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-8 md:p-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-sm font-black text-gray-900 tracking-tighter uppercase">Pièces & Consommables</h2>
                                    </div>

                                    <div className="relative mb-6">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                                        <Input
                                            placeholder="Rechercher une pièce..."
                                            value={productSearch}
                                            onChange={e => setProductSearch(e.target.value)}
                                            className="h-16 pl-16 rounded-2xl bg-gray-50/50 border-none font-bold text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                        {filteredProducts.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => addProduct(p)}
                                                disabled={p.stock <= 0}
                                                className="w-full flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all group"
                                            >
                                                <div className="text-left">
                                                    <div className="font-black text-gray-900 text-xs uppercase italic">{p.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{p.price.toLocaleString()} FCFA • Stock: {p.stock}</div>
                                                </div>
                                                <div className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-red-600 group-hover:border-red-100 transition-all">
                                                    <Plus className="h-4 w-4" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary / Cart */}
                                <div className="bg-gray-900 rounded-[3rem] border border-gray-800 shadow-2xl p-8 md:p-10 text-white flex flex-col">
                                    <h2 className="text-sm font-black text-white/40 tracking-tighter uppercase mb-8">Récapitulatif Sélection</h2>

                                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 no-scrollbar mb-8 flex-1">
                                        {formData.selectedServices.map(sName => (
                                            <div key={sName} className="flex items-center justify-between py-3 border-b border-white/5 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                                    <span className="text-xs font-black tracking-tight uppercase italic">{sName}</span>
                                                </div>
                                                <button onClick={() => toggleService(sName, 0)} className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 hover:text-red-600 hover:bg-red-600/10 transition-all">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}

                                        {formData.addedProducts.map(p => (
                                            <div key={p.id} className="flex items-center justify-between py-3 border-b border-white/5 group">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-black tracking-tight uppercase italic">{p.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => updateProductQty(p.id, -1)} className="h-6 w-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-red-600 transition-colors">-</button>
                                                        <span className="text-[10px] font-black text-white/30 px-2 uppercase">Qté: {p.quantity}</span>
                                                        <button onClick={() => updateProductQty(p.id, 1)} className="h-6 w-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-red-600 transition-colors">+</button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black tabular-nums">{(p.price * p.quantity).toLocaleString()} <span className="opacity-40">F</span></span>
                                                    <button onClick={() => removeProduct(p.id)} className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 hover:text-red-600 hover:bg-red-600/10 transition-all">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {formData.selectedServices.length === 0 && formData.addedProducts.length === 0 && (
                                            <div className="py-20 text-center text-white/10 font-black text-sm uppercase tracking-widest italic">
                                                Aucune sélection
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-white/10 space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Symptômes & Observations</p>
                                            <textarea
                                                value={formData.symptoms}
                                                onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                                                placeholder="Décrivez les problèmes signalés par le client..."
                                                className="w-full bg-white/5 border-none rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-red-600/50 min-h-[120px] transition-all placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between">
                                <Button variant="ghost" onClick={handleBack} className="h-16 px-8 font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">Précédent</Button>
                                <Button
                                    disabled={formData.selectedServices.length === 0 || !formData.symptoms}
                                    onClick={handleNext}
                                    className="h-16 px-12 bg-gray-900 hover:bg-red-600 text-white rounded-2xl font-black gap-4 transition-all hover:scale-[1.02] shadow-xl shadow-gray-200"
                                >
                                    Valider le dossier <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: VALIDATION & RÈGLEMENT */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="grid lg:grid-cols-3 gap-8"
                    >
                        {/* Summary Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-8 md:p-12">
                                <h2 className="text-sm font-black text-gray-900 tracking-tighter uppercase ml-1 mb-10">Récapitulatif de l'Intervention</h2>

                                <div className="grid md:grid-cols-2 gap-12 mb-12">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                                <Users className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Client</div>
                                                <div className="font-black text-xl text-gray-900 tracking-tight">{selectedClient?.name}</div>
                                                <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">{selectedClient?.phone}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-[2rem] bg-gray-900 flex items-center justify-center text-white shadow-xl shadow-gray-200">
                                                <Car className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Véhicule</div>
                                                <div className="font-black text-xl text-gray-900 tracking-tight uppercase italic">{selectedVehicle?.brand} {selectedVehicle?.model}</div>
                                                <div className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg mt-1 tracking-widest italic">{selectedVehicle?.plate}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Expertise Réception</div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-red-600" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase">État</span>
                                                </div>
                                                <span className="text-xs font-black text-gray-900">{formData.condition}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-red-600" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase">Propreté</span>
                                                </div>
                                                <span className="text-xs font-black text-gray-900">{formData.cleanliness}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-red-600" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase">Carburant</span>
                                                </div>
                                                <span className="text-xs font-black text-gray-900">{formData.fuelLevel}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prestations & Pièces sélectionnées</div>
                                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
                                        <div className="space-y-4">
                                            {formData.selectedServices.map(s => (
                                                <div key={s} className="flex justify-between items-center text-sm">
                                                    <span className="font-black italic uppercase text-white/80">{s}</span>
                                                    <span className="font-black text-white/40">Inclus</span>
                                                </div>
                                            ))}
                                            {formData.addedProducts.map(p => (
                                                <div key={p.id} className="flex justify-between items-center text-sm">
                                                    <span className="font-black italic uppercase text-white/80">{p.name} <span className="text-[10px] not-italic text-white/20 ml-2">x{p.quantity}</span></span>
                                                    <span className="font-black text-white/40">{(p.price * p.quantity).toLocaleString()} F</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-end">
                                            <div>
                                                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Date d'entrée</div>
                                                <div className="font-black text-lg">{new Date(formData.dateIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Montant Total</div>
                                                <div className="text-3xl font-black text-red-500 tabular-nums">{totalCost.toLocaleString()} <span className="text-sm">FCFA</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Column */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-10">
                                <h3 className="text-sm font-black text-gray-900 tracking-tighter uppercase mb-10">Règlement</h3>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Flux de facturation <span className="text-red-600">*</span></label>
                                        <div className="grid grid-cols-1 gap-2 p-1.5 bg-gray-50 rounded-[2rem]">
                                            {[
                                                { id: "Encaisser maintenant", label: "Paiement Immédiat", sub: "Génère une facture payée" },
                                                { id: "À la livraison", label: "Paiement à la sortie", sub: "En attente de règlement" }
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setFormData({ ...formData, paymentStatus: opt.id })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center py-5 px-6 rounded-[1.75rem] transition-all",
                                                        formData.paymentStatus === opt.id
                                                            ? "bg-white text-gray-900 shadow-xl shadow-gray-200 border border-gray-100"
                                                            : "text-gray-400 hover:text-gray-600"
                                                    )}
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{opt.label}</span>
                                                    <span className="text-[8px] font-bold opacity-50 mt-1 uppercase">{opt.sub}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Méthode de Paiement <span className="text-red-600">*</span></label>
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
                                                        "flex flex-col items-center gap-3 p-6 rounded-[1.75rem] border-2 transition-all group",
                                                        formData.paymentMethod === m.id
                                                            ? "border-red-600 bg-red-50/20 text-red-600 shadow-lg shadow-red-100/50"
                                                            : "border-gray-50 bg-gray-50/30 text-gray-400 hover:border-gray-200 hover:bg-white"
                                                    )}
                                                >
                                                    <m.icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", formData.paymentMethod === m.id ? "text-red-600" : "text-gray-300")} />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{m.id}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-gray-50">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="w-full h-20 bg-gray-900 hover:bg-red-600 text-white rounded-[2rem] font-black text-xl gap-4 shadow-2xl shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95 group"
                                    >
                                        {isLoading ? (
                                            "Ouverture du dossier..."
                                        ) : (
                                            <>
                                                Confirmer & Créer <Save className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </Button>

                                    <Button variant="ghost" onClick={handleBack} className="w-full h-14 mt-4 font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest text-[10px]">
                                        Modifier les informations
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
