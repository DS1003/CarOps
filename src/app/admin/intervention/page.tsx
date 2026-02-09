export const dynamic = "force-dynamic";

import { getInterventions } from "@/app/actions/interventions";
import { InterventionList } from "@/components/dashboard/intervention-list";

export default async function AdminInterventionsPage() {
    const result = await getInterventions();
    const interventions = result.success ? result.data : [];

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <InterventionList initialInterventions={interventions || []} />
        </div>
    );
}
