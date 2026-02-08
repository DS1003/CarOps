import { getInterventions } from "@/app/actions/interventions";
import { getProducts } from "@/app/actions/products";
import { getServices } from "@/app/actions/services";
import { NewInvoiceForm } from "@/components/forms/new-invoice-form";

export default async function NewInvoicePage() {
    const [interventionsResult, productsResult, servicesResult] = await Promise.all([
        getInterventions(),
        getProducts(),
        getServices()
    ]);

    const interventions = interventionsResult.success ? interventionsResult.data : [];
    const products = productsResult.success ? productsResult.data : [];
    const services = servicesResult.success ? servicesResult.data : [];

    // Only finished interventions that aren't yet invoiced
    const readyInterventions = interventions.filter((i: any) => i.status === "Terminé" && !i.invoice);

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans p-6 md:p-12">
            <NewInvoiceForm
                interventions={readyInterventions}
                products={products}
                services={services}
            />
        </div>
    );
}
