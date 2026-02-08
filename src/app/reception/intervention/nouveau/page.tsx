import { getClients } from "@/app/actions/clients";
import { getVehicles } from "@/app/actions/vehicles";
import { getServices } from "@/app/actions/services";
import { getProducts } from "@/app/actions/products";
import { NewInterventionForm } from "@/components/forms/new-intervention-form";

export default async function NewInterventionPage({
    searchParams
}: {
    searchParams: Promise<{ clientId?: string }> | { clientId?: string }
}) {
    const sParams = await searchParams;
    const [clientsResult, vehiclesResult, servicesResult, productsResult] = await Promise.all([
        getClients(),
        getVehicles(),
        getServices(),
        getProducts()
    ]);

    const clients = clientsResult.success ? clientsResult.data : [];
    const vehicles = vehiclesResult.success ? vehiclesResult.data : [];
    const services = servicesResult.success ? servicesResult.data : [];
    const products = productsResult.success ? productsResult.data : [];

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans p-5 md:p-8 lg:p-12">
            <div className="max-w-[1600px] mx-auto">
                <NewInterventionForm
                    clients={clients || []}
                    vehicles={vehicles || []}
                    services={services || []}
                    products={products || []}
                    preSelectedClientId={sParams.clientId}
                />
            </div>
        </div>
    );
}
