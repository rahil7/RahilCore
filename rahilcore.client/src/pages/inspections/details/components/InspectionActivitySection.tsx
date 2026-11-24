import { History } from "lucide-react";

export default function InspectionActivitySection() {
    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm space-y-3">
            <div>
                <h3 className="font-semibold">Activity History</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Inspection activity log
                </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-6 text-center">
                <History className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                    Activity history will appear here
                </p>
            </div>
        </div>
    );
}