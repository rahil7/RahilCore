import { X } from "lucide-react";
import { formatDate } from "../../../utils/date-utils";

interface OrderActiveFiltersProps {
    createdFrom: string
    createdTo: string
    activeCustomerTypes: string[];
    activeStatuses: string[];
    activePaymentStatuses: string[];

    onRemoveCustomerType: () => void;
    onRemoveStatus: () => void;
    onRemovePaymentStatus: () => void;
    onClearAll: () => void;
}

export default function OrderActiveFilters({
    createdFrom,
    createdTo,
    activeCustomerTypes,
    activeStatuses,
    activePaymentStatuses,
    onRemoveCustomerType,
    onRemoveStatus,
    onRemovePaymentStatus,
    onClearAll,
}: OrderActiveFiltersProps) {

    const visibleStatuses = activeStatuses.slice(0, 2);
    const hiddenStatusCount = activeStatuses.length - visibleStatuses.length;

    const statusLabel =
        activeStatuses.length > 0
            ? `Status: ${visibleStatuses.join(", ")}${hiddenStatusCount > 0 ? ` +${hiddenStatusCount}` : ""}`
            : "";

    return (
        <div className="rounded-lg border bg-card p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Filter Chips */}
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {/* Created From */}
                    <ActiveFilterChip
                        label={`Tanggal : ${formatDate(createdFrom)} - ${formatDate(createdTo)}`}
                        onRemove={() => { } }
                    />

                    {/* Status*/}
                    {activeStatuses.length > 0 && (
                        <ActiveFilterChip
                            label={statusLabel}
                            onRemove={onRemoveStatus}
                        />
                    )}

                    {/* Status*/}
                    {activePaymentStatuses.length > 0 && (
                        <ActiveFilterChip
                            label={`Payment Status: ${activePaymentStatuses.join(", ")}`}
                            onRemove={onRemovePaymentStatus}
                        />
                    )}

                    {/* Customer Type */}
                    {activeCustomerTypes.length > 0 && (
                        <ActiveFilterChip
                            label={`Customer Type: ${activeCustomerTypes.join(", ")}`}
                            onRemove={onRemoveCustomerType}
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