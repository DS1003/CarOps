export const dynamic = "force-dynamic";

import { getVehicles } from "@/app/actions/vehicles";
import { VehicleList } from "@/components/dashboard/vehicle-list";

export default async function AdminVehiclesPage() {
    const vehiclesResult = await getVehicles();
    const vehicles = vehiclesResult.success ? vehiclesResult.data : [];

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <VehicleList initialVehicles={vehicles || []} />
        </div>
    );
}
