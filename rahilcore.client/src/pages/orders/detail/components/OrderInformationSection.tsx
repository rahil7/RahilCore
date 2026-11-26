import {
    ClipboardList,
    CalendarDays,
    UserRound,
    Phone,
    MessageSquareText,
} from "lucide-react";

import { formatDateTime } from "../../../../utils/date-utils";

interface OrderInformationSectionProps {
    inspectionForm: string;
    scheduleAt: string;
    picName?: string | null;
    picPhone?: string | null;
    note: string;
}

export default function OrderInformationSection({
    inspectionForm,
    scheduleAt,
    picName,
    picPhone,
    note,
}: OrderInformationSectionProps) {
    const items = [
        {
            label: "Inspection Form",
            value: inspectionForm || "-",
            icon: ClipboardList,
        },
        {
            label: "Inspection Date",
            value: formatDateTime(scheduleAt),
            icon: CalendarDays,
        },
        {
            label: "Contact Person",
            value: picName || "-",
            icon: UserRound,
        },
        {
            label: "Contact Phone",
            value: picPhone || "-",
            icon: Phone,
        },
    ];

    return (
        <section className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold">Order Information</h3>

            <div className="grid gap-x-8 gap-y-5 pt-5 sm:grid-cols-2">
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

                {/* Note */}
                <div className="min-w-0 space-y-1.5 sm:col-span-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquareText className="h-4 w-4 shrink-0" />
                        <span className="text-sm">Notes</span>
                    </div>

                    <p className="whitespace-pre-wrap break-words text-sm font-medium">
                        {note || "-"}
                    </p>
                </div>
            </div>
        </section>
    );
}