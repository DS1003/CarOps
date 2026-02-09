export const dynamic = "force-dynamic";

import { getInterventions } from "@/app/actions/interventions";
import { InterventionKanban } from "@/components/dashboard/intervention-kanban";

export default async function AtelierPage() {
    const result = await getInterventions();
    const interventions = result.success ? result.data : [];

    return (
        <div className="bg-gray-50/30 min-h-screen font-sans p-6 md:p-12">
            <div className="max-w-[1920px] mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Espace Mécanicien</h1>
                    <p className="text-gray-500 font-medium">Gestion des tâches et suivi des réparations.</p>
                </div>
                <InterventionKanban initialInterventions={interventions || []} />
            </div>
        </div>
    );
}
