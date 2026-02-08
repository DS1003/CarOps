import { getInvoices } from "@/app/actions/invoices";
import { NewPaymentForm } from "@/components/forms/new-payment-form";

export default async function NewPaymentPage() {
    const result = await getInvoices();
    const invoices = result.success ? result.data : [];

    // Only pending invoices
    const pendingInvoices = invoices.filter((inv: any) => inv.status === "En attente");

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans p-6 md:p-12">
            <NewPaymentForm invoices={pendingInvoices} />
        </div>
    );
}
