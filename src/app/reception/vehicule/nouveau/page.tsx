import { getClients } from "@/app/actions/clients";
import { NewVehicleForm } from "@/components/forms/new-vehicle-form";

export default async function NewVehiclePage() {
    const clientsResult = await getClients();
    const clients = clientsResult.success ? clientsResult.data : [];

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans p-6 md:p-12">
            <NewVehicleForm clients={clients || []} />
        </div>
    );
}
