import { getClients } from "@/app/actions/clients";
import { getVehicles } from "@/app/actions/vehicles";
import { getServices } from "@/app/actions/services";
import { NewInterventionForm } from "@/components/forms/new-intervention-form";

export default async function NewInterventionPage({
    searchParams
}: {
    searchParams: Promise<{ clientId?: string }> | { clientId?: string }
}) {
    const sParams = await searchParams;
    const [clientsResult, vehiclesResult, servicesResult] = await Promise.all([
        getClients(),
        getVehicles(),
        getServices()
    ]);

    const clients = clientsResult.success ? clientsResult.data : [];
    const vehicles = vehiclesResult.success ? vehiclesResult.data : [];
    const services = servicesResult.success ? servicesResult.data : [];

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans p-6 md:p-12">
            <NewInterventionForm
                clients={clients || []}
                vehicles={vehicles || []}
                services={services || []}
                preSelectedClientId={sParams.clientId}
            />
        </div>
    );
}
