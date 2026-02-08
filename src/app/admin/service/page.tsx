import { getServices } from "@/app/actions/services";
import { ServiceList } from "@/components/dashboard/service-list";

export default async function AdminServicePage() {
    const servicesResult = await getServices();
    const services = servicesResult.success ? servicesResult.data : [];

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            <ServiceList initialServices={services || []} />
        </div>
    );
}
