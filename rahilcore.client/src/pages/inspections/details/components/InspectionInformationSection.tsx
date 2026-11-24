interface InspectionInformationSectionProps {
    inspectionFormName: string | null;
    scheduleAt: string | null;
    inspectorName: string | null;
    assignedAt: string | null;
    submittedAt: string | null;
}

function formatDateTime(value: string | null) {
    if (!value) return "—";

    return new Date(value).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function InspectionInformationSection({
    inspectionFormName,
    scheduleAt,
    inspectorName,
    assignedAt,
    submittedAt,
}: InspectionInformationSectionProps) {
    const fields = [
        { label: "Inspection Form", value: inspectionFormName },
        { label: "Schedule", value: formatDateTime(scheduleAt) },
        { label: "Inspector", value: inspectorName },
        { label: "Assigned At", value: formatDateTime(assignedAt) },
        { label: "Submitted At", value: formatDateTime(submittedAt) },
    ];

    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
            <div>
                <h3 className="font-semibold">Inspection Information</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Assignment and inspection schedule
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.label} className="min-w-0 space-y-1">
                        <p className="text-xs text-muted-foreground">
                            {field.label}
                        </p>
                        <p className="text-sm font-medium break-words">
                            {field.value || "—"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}