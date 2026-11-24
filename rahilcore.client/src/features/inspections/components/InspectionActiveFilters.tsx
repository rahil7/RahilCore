import { X } from "lucide-react";
import { formatDate } from "../../../utils/date-utils";
import { formatFilterLabel } from "../../../utils/filter";

interface InspectionActiveFiltersProps {
    scheduleFrom: string
    scheduleTo: string
    activeCustomerTypes: string[];
    activeStatuses: string[];
    activeInspectors: string[];

    onRemoveCustomerType: () => void;
    onRemoveStatus: () => void;
    onRemoveInspector: () => void;
    onClearAll: () => void;
}

export default function InspectionActiveFilters({
    scheduleFrom,
    scheduleTo,
    activeCustomerTypes,
    activeStatuses,
    activeInspectors,
    onRemoveCustomerType,
    onRemoveStatus,
    onRemoveInspector,
    onClearAll,
}: InspectionActiveFiltersProps) {

    const statusLabel = formatFilterLabel("Status", activeStatuses);
    const inspectionLabel = formatFilterLabel("Status", activeStatuses);

    return (
        <div className="rounded-lg border bg-card p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Filter Chips */}
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <ActiveFilterChip
                        label={`Tanggal Inspeksi : ${formatDate(scheduleFrom)} - ${formatDate(scheduleTo)}`}
                        onRemove={() => { } }
                    />

                    {activeStatuses.length > 0 && (
                        <ActiveFilterChip
                            label={statusLabel}
                            onRemove={onRemoveStatus}
                        />
                    )}

                    {activeCustomerTypes.length > 0 && (
                        <ActiveFilterChip
                            label={`Tipe Customer: ${activeCustomerTypes.join(", ")}`}
                            onRemove={onRemoveCustomerType}
                        />
                    )}

                    {activeInspectors.length > 0 && (
                        <ActiveFilterChip
                            label={inspectionLabel}
                            onRemove={onRemoveInspector}
                        />
                    )}

                </div>

                {/* Clear All */}
                <button
                    type="button"
                    onClick={onClearAll}
                    className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
}

function ActiveFilterChip({
    label,
    onRemove,
}: {
    label: string;
    onRemove: () => void;
}) {
    return (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1 text-xs">
            <span className="truncate">{label}</span>

            <button
                type="button"
                onClick={onRemove}
                aria-label={`Hapus filter ${label}`}
                className="shrink-0 rounded-sm text-muted-foreground hover:text-foreground"
            >
                <X size={13} />
            </button>
        </span>
    );
}