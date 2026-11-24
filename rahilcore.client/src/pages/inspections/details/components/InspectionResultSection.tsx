import { ClipboardCheck } from "lucide-react";

export default function InspectionResultSection() {
    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm space-y-3">
            <div>
                <h3 className="font-semibold">Inspection Result</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Inspector findings and checklist
                </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                <ClipboardCheck className="h-8 w-8 text-muted-foreground mb-2" />

                <p className="text-sm font-medium">
                    Inspection result will appear here
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                    Checklist, photos, and findings
                </p>
            </div>
        </div>
    );
}