import {
    ClipboardList,
    CalendarDays,
    UserRound,
    Clock3,
    CheckCircle2,
    Contact,
    Phone,
} from "lucide-react";

import { formatDateTime } from "../../../../utils/date-utils";

interface InspectionInformationSectionProps {
    inspectionFormName: string | null;
    scheduleAt: string | null;
    inspectorName: string | null;
    assignedAt: string | null;
    submittedAt: string | null;
    contactPerson: string | null;
    contactPhone: string | null;
}

export default function InspectionInformationSection({
    inspectionFormName,
    scheduleAt,
    inspectorName,
    assignedAt,
    submittedAt,
    contactPerson,
    contactPhone,
}: InspectionInformationSectionProps) {
    const items = [
        {
            label: "Inspection Form",
            value: inspectionFormName || "-",
            icon: ClipboardList,
        },
        {
            label: "Inspection Date",
            value: scheduleAt ? formatDateTime(scheduleAt) : "-",
            icon: CalendarDays,
        },
        {
            label: "Inspector",
            value: inspectorName || "-",
            icon: UserRound,
        },
        {
            label: "Contact Person",
            value: contactPerson || "-",
            icon: Contact,
        },
        {
            label: "Contact Phone",
            value: contactPhone || "-",
            icon: Phone,
        },
        {
            label: "Assigned At",
            value: assignedAt ? formatDateTime(assignedAt) : "-",
            icon: Clock3,
        },
        {
            label: "Submitted At",
            value: submittedAt ? formatDateTime(submittedAt) : "-",
            icon: CheckCircle2,
        },
    ];

    return (
        <section className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold">Inspection Information</h3>

            <div className="grid gap-x-8 gap-y-5 pt-4 sm:grid-cols-2">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="min-w-0 space-y-1.5"
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="text-sm">
                                    {item.label}
                                </span>
                            </div>

                            <p className="break-words text-sm font-medium">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}