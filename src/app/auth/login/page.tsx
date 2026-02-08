"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<{ message: string } | null>(null);
    const [success, setSuccess] = useState(false);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!email || !password) {
            setError({ message: "Veuillez remplir tous les champs." });
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            setSuccess(true);
            setTimeout(() => {
                if (email.includes("reception")) router.push("/reception");
                else if (email.includes("secretaire")) router.push("/secretaire");
                else if (email.includes("atelier") || email.includes("meca")) router.push("/atelier");
                else router.push("/admin");
            }, 1000);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen overflow-hidden bg-white">
            {/* LEFT SECTION - PROMO */}
            <div className="hidden lg:flex w-1/2 relative bg-[#0f1115] overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]"></div>

                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-20 text-center">
                    <div className="mb-12 animate-in fade-in zoom-in duration-1000">
                        <div className="h-32 w-auto flex items-center justify-center transition-all duration-500 scale-110">
                            <img src="/logo.png" alt="RV 69 Logo" className="h-full w-auto object-contain" />
                        </div>
                    </div>

                    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <h1 className="text-7xl font-black tracking-tighter text-white uppercase italic">
                            RV <span className="text-primary">69</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
                            VENTE • ACHAT • ENTRETIEN
                            <br />
                            <span className="text-sm tracking-[0.3em] font-black text-primary/80">AUTO MOTOS</span>
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-2 gap-4 w-full max-w-md animate-in fade-in duration-1000 delay-500">
                        {[
                            { label: "Vente Auto/Moto", icon: CheckCircle2 },
                            { label: "Achat Cash", icon: CheckCircle2 },
                            { label: "Entretien Rapide", icon: CheckCircle2 },
                            { label: "Gestion Premium", icon: CheckCircle2 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 text-sm font-bold backdrop-blur-sm">
                                <item.icon className="h-4 w-4 text-primary" />
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION - FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-md">
                    <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 animate-in slide-in-from-right-12 duration-1000">
                        <div className="mb-10 text-center lg:hidden">
                            <img src="/logo.png" alt="RV 69 Logo" className="h-20 mx-auto mb-4" />
                            <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">
                                RV <span className="text-primary">69</span>
                            </h2>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-900 mb-2 mt-2">Bienvenue chez RV 69</h2>
                            <p className="text-gray-500 font-medium">Accédez à votre plateforme de gestion automobile.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in shake">
                                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-red-900">Erreur</h4>
                                    <p className="text-xs text-red-700 mt-0.5">{error.message}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Email Professionnel</label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="contact@rv69.fr"
                                    className="h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-primary focus:ring-primary/20 px-5 text-gray-900 font-medium transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Mot de passe</label>
                                    <a href="#" className="text-xs font-bold text-primary hover:underline">Oublié ?</a>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-primary focus:ring-primary/20 px-5 pr-12 text-gray-900 font-medium transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || success}
                                className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-lg shadow-xl shadow-gray-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        Chargement...
                                    </span>
                                ) : success ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" /> Accès autorisé
                                    </span>
                                ) : (
                                    "Se connecter"
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                RV 69 • Système de Gestion Sécurisé v3.0
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
