import { X } from "lucide-react";
interface CustomerActiveFiltersProps {
    activeFilterCount: number;
    activeCustomerTypes: string[];
    activeStatuses: string[];
    activeCitiesCount: number;
    cityLabel: string;

    onRemoveCustomerType: () => void;
    onRemoveStatus: () => void;
    onRemoveCity: () => void;
    onClearAll: () => void;
}

export default function CustomerActiveFilters({
    activeFilterCount,
    activeCustomerTypes,
    activeStatuses,
    cityLabel,
    activeCitiesCount,
    onRemoveCustomerType,
    onRemoveStatus,
    onRemoveCity,
    onClearAll,
}: CustomerActiveFiltersProps) {
    if (activeFilterCount === 0) {
        return null;
    }

    return (
        <div className="rounded-lg border bg-card p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Filter Chips */}
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {/* Customer Type */}
                    {activeCustomerTypes.length > 0 && (
                        <ActiveFilterChip
                            label={`Customer Type: ${activeCustomerTypes.join(", ")}`}
                            onRemove={onRemoveCustomerType}
                        />
                    )}

                    {/* Status */}
                    {activeStatuses.length > 0 && (
                        <ActiveFilterChip
                            label={`Status: ${activeStatuses.join(", ")}`}
                            onRemove={onRemoveStatus}
                        />
                    )}

                    {/* City */}
                    {activeCitiesCount > 0 && (
                        <ActiveFilterChip
                            label={`City: ${cityLabel}`}
                            onRemove={onRemoveCity}
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
};

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