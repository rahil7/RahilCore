import { formatDateTime } from "../../../../utils/date-utils";

interface OrderInformationSectionProps {
    inspectionForm: string;
    scheduleAt: string;
    note: string;
}

export default function OrderInformationSection({
    inspectionForm,
    scheduleAt,
    note,
}: OrderInformationSectionProps) {
    return (
        <section className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-semibold">
                Informasi Order
            </h3>

            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Inspection Form
                    </p>
                    <p className="text-sm font-medium">
                        {inspectionForm || "-"}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Jadwal Inspeksi
                    </p>
                    <p className="text-sm font-medium">
                        {formatDateTime(scheduleAt)}
                    </p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                    <p className="text-sm text-muted-foreground">
                        Note
                    </p>
                    <p className="whitespace-pre-wrap text-sm font-medium">
                        {note || "-"}
                    </p>
                </div>
            </div>
        </section>
    );
}
