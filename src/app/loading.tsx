export default function Loading() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-gray-400 animate-pulse italic">
                    RV <span className="text-primary italic">69</span>
                </p>
            </div>
        </div>
    );
}
