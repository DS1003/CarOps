export const dynamic = "force-dynamic";

import { getInvoices } from "@/app/actions/invoices";
import { InvoiceList } from "@/components/dashboard/invoice-list";

export default async function SecretariatInvoicesPage() {
    const result = await getInvoices();
    const invoices = result.success ? result.data : [];

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <InvoiceList initialInvoices={invoices || []} isAdmin={false} />
        </div>
    );
}
