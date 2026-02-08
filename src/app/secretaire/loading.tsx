export default function Loading() {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-gray-200 rounded-xl" />
                    <div className="h-4 w-96 bg-gray-100 rounded-lg" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-50 rounded-[2rem] border border-gray-100" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[600px] bg-white rounded-[3rem] border border-gray-100" />
                <div className="space-y-6">
                    <div className="h-40 bg-gray-50 rounded-[2.5rem] border border-gray-100" />
                    <div className="h-40 bg-gray-900 rounded-[2.5rem]" />
                </div>
            </div>
        </div>
    );
}
