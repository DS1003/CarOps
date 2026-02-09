export const dynamic = "force-dynamic";

import { getClients } from "@/app/actions/clients";
import { ClientList } from "@/components/dashboard/client-list";

export default async function AdminClientsPage() {
    const clientsResult = await getClients();
    const clients = clientsResult.success ? clientsResult.data : [];

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <ClientList initialClients={clients || []} />
        </div>
    );
}
