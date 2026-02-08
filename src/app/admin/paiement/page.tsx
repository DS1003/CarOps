import { getInvoices } from "@/app/actions/invoices";
import {
    Plus, Search, Banknote, Download, Filter, CreditCard, History, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function PaiementsPage() {
    const result = await getInvoices();
    // In this simplified system, a payment is a 'Payée' invoice
    const paidInvoices = result.success ? result.data.filter((i: any) => i.status === "Payée") : [];

    const totalEncaisse = paidInvoices.reduce((s: number, i: any) => s + i.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Paiements</h1>
                    <p className="text-muted-foreground font-medium">Historique des transactions et règlements clients.</p>
                </div>
                <Link href="/secretaire/paiement/nouveau">
                    <Button className="h-12 bg-emerald-600 text-white rounded-2xl gap-2 font-black transition-all">
                        <Plus className="h-5 w-5" /> Encaisser Règlement
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="rounded-3xl border-gray-100 shadow-lg p-6 bg-white flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Encaissé</p>
                        <h3 className="text-3xl font-black text-gray-900">{totalEncaisse.toLocaleString()} €</h3>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Banknote className="h-6 w-6" />
                    </div>
                </Card>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/30 border-b border-gray-50">
                                <th className="py-5 px-8 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">Transaction</th>
                                <th className="py-5 px-8 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">Client</th>
                                <th className="py-5 px-8 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paidInvoices.map((inv: any) => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <Banknote className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900">{inv.id}</div>
                                                <div className="text-[10px] font-bold text-gray-400">{new Date(inv.updatedAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 font-black text-gray-900">{inv.intervention.client.name}</td>
                                    <td className="py-5 px-8 text-right text-lg font-black text-emerald-600">{inv.amount} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
