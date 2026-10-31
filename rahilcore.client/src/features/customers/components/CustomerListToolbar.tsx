import { useEffect, useRef, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    ArrowDown,
    ArrowUp
} from "lucide-react";
import SelectField from "../../../components/shared/SelectField";
import FilterDialog from "../../../components/shared/FilterDialog";
import CustomerFilterContent, {
    type CustomerFilters,
} from "./CustomerFilterContent";
import type { CustomerFilterOptions } from "../../../types/customer";
import { X } from "lucide-react";

export interface CustomerListQuery {
    searchBy: string;
    searchKey: string;
    sortBy: string;
    sortDirection: "asc" | "desc";
    filters: CustomerFilters;
}

interface CustomerListToolbarProps {
    filterOptions: CustomerFilterOptions;
    onQueryChange: (query: CustomerListQuery) => void;
}

export default function CustomerListToolbar({
    filterOptions,
    onQueryChange,
}: CustomerListToolbarProps) {
    const [searchKey, setSearchKey] = useState("");
    const [searchBy, setSearchBy] = useState("custName");
    const [sortBy, setSortBy] = useState("lastActivityAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const initialFilters: CustomerFilters = {
        custTypeIds: [],
        cityIds: [],
        status: [],
    };

    const [appliedFilters, setAppliedFilters] = useState<CustomerFilters>(initialFilters);

    const latestQueryRef = useRef<CustomerListQuery>({
        searchBy,
        searchKey,
        sortBy,
        sortDirection,
        filters: appliedFilters,
    });

    latestQueryRef.current = {
        searchBy,
        searchKey,
        sortBy,
        sortDirection,
        filters: appliedFilters,
    };

    const isInitialSearch = useRef(true);

    useEffect(() => {
        if (isInitialSearch.current) {
            isInitialSearch.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            onQueryChange(latestQueryRef.current);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchKey, onQueryChange]);

    const [, setDraftFilters] = useState<CustomerFilters>(initialFilters);

    function handleOpenFilter() {
        setDraftFilters({
            custTypeIds: [...appliedFilters.custTypeIds],
            cityIds: [...appliedFilters.cityIds],
            status: [...appliedFilters.status],
        });

        setIsFilterOpen(true);
    }

    const activeCustomerTypes = appliedFilters
        .custTypeIds
        .map((id) =>
            filterOptions.customerTypes.find((item) => item.id === id)?.name
        )
        .filter((name): name is string => Boolean(name));

    const activeStatuses = appliedFilters.status
        .map((value) =>
            filterOptions.statuses.find((item) => item.value === value)?.label
        )
        .filter((label): label is string => Boolean(label));

    const activeCities = appliedFilters.cityIds
        .map((id) =>
            filterOptions.cities.find((item) => item.id === id)?.name
        )
        .filter((name): name is string => Boolean(name));

    const cityLabel =
        activeCities.length > 2
            ? `${activeCities.slice(0, 2).join(", ")} +${activeCities.length - 2}`
            : activeCities.join(", ");

    const activeFilterCount = [
        activeCustomerTypes.length > 0,
        activeStatuses.length > 0,
        activeCities.length > 0,
    ].filter(Boolean).length;

    function handleClearAllFilters() {
        const nextFilters: CustomerFilters = {
            custTypeIds: [],
            cityIds: [],
            status: [],
        };

        setAppliedFilters(nextFilters);
        notifyQueryChange({ filters: nextFilters });
    }

    function clearFilter(key: keyof CustomerFilters) {
        const nextFilters = {
            ...appliedFilters,
            [key]: [],
        };

        setAppliedFilters(nextFilters);
        notifyQueryChange({ filters: nextFilters });
    }

    function notifyQueryChange(
        changes: Partial<CustomerListQuery>
    ) {
        onQueryChange({
            searchBy,
            searchKey,
            sortBy,
            sortDirection,
            filters: appliedFilters,
            ...changes,
        });
    };

    function applyFilters(filters: CustomerFilters) {
        setAppliedFilters(filters);
        setIsFilterOpen(false);

        notifyQueryChange({ filters });
    }

    return (
        <div className="@container w-full min-w-0 space-y-2">
            {/* Toolbar */}
            <div className="grid w-full min-w-0 grid-cols-1 gap-3 rounded-lg border bg-card p-3 @md:grid-cols-2 @[64rem]:flex @[64rem]:items-center">
                {/* Search field */}
                <SelectField
                    value={searchBy}
                    onChange={(value) => {
                        setSearchBy(value);
                        notifyQueryChange({ searchBy: value });
                    }}
                    ariaLabel="Cari berdasarkan"
                    className="w-full min-w-0 @md:order-1 @[64rem]:order-none @[64rem]:w-44 @[64rem]:shrink-0"
                    options={filterOptions.searchFields.map((item) => ({
                        value: item.value,
                        label: item.label,
                    }))}
                />

                {/* Search keyword */}
                <div className="flex h-10 w-full min-w-0 items-center gap-2 rounded-md border bg-background px-3 @md:order-3 @md:col-span-2 @[64rem]:order-none @[64rem]:flex-1">
                    <Search
                        size={16}
                        className="shrink-0 text-muted-foreground"
                    />

                    <input
                        type="text"
                        value={searchKey}
                        onChange={(event) => {
                            setSearchKey(event.target.value);
                        }}
                        placeholder="Cari Customer..."
                        aria-label="Kata kunci pencarian"
                        className="box-border h-10 min-h-10 w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:outline-none focus:ring-0"
                    />
                </div>

                {/* Sort field */}
                <div className="relative w-full min-w-0 @md:order-2 @[64rem]:order-none @[64rem]:w-44 @[64rem]:shrink-0">
                    <SelectField
                        value={sortBy}
                        onChange={(value) => {
                            setSortBy(value);
                            notifyQueryChange({ sortBy: value });
                        }}
                        ariaLabel="Cari berdasarkan"
                        className="w-full min-w-0"
                        options={filterOptions.sortFields.map((item) => ({
                            value: item.value,
                            label: item.label,
                        }))}
                    />
                </div>

                {/* Sort direction & Filter */}
                <div className="flex w-full min-w-0 items-center justify-end gap-2 @md:order-4 @md:col-span-2 @[64rem]:order-none @[64rem]:w-auto @[64rem]:shrink-0">
                    <button
                        type="button"
                        aria-label={
                            sortDirection === "asc"
                                ? "Ubah ke descending"
                                : "Ubah ke ascending"
                        }
                        title={
                            sortDirection === "asc"
                                ? "Ascending — klik untuk descending"
                                : "Descending — klik untuk ascending"
                        }
                        onClick={() => {
                            const next = sortDirection === "asc" ? "desc" : "asc";

                            setSortDirection(next);
                            notifyQueryChange({ sortDirection: next });
                        }}
                        className="inline-flex size-10 w-10 shrink-0 items-center justify-center rounded-md border hover:bg-muted"
                    >
                        {sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                        ) : (
                            <ArrowDown size={16} />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleOpenFilter}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted md:flex-none"
                    >
                        <SlidersHorizontal size={16} />
                        Filter

                        {activeFilterCount > 0 && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                <FilterDialog
                    open={isFilterOpen}
                    title="Filter Customers"
                    onClose={() => setIsFilterOpen(false)}
                    onApply={() => setIsFilterOpen(false)}
                >
                    <CustomerFilterContent
                        key={isFilterOpen ? "open" : "closed"}
                        open={isFilterOpen}
                        options={filterOptions}
                        appliedFilters={appliedFilters}
                        onApply={applyFilters}
                        onClose={() => setIsFilterOpen(false)}
                    />
                </FilterDialog>
            </div>

            {/* Active Filters Section */}
            {activeFilterCount > 0 && (
                <div className="rounded-lg border bg-card p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">

                        {/* Filter Chips */}
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                            {/* Customer Type */}
                            {activeCustomerTypes.length > 0 && (
                                <ActiveFilterChip
                                    label={`Customer Type: ${activeCustomerTypes.join(", ")}`}
                                    onRemove={() => clearFilter("custTypeIds")}
                                />
                            )}

                            {/* Status */}
                            {activeStatuses.length > 0 && (
                                <ActiveFilterChip
                                    label={`Status: ${activeStatuses.join(", ")}`}
                                    onRemove={() => clearFilter("status")}
                                />
                            )}

                            {/* City */}
                            {activeCities.length > 0 && (
                                <ActiveFilterChip
                                    label={`City: ${cityLabel}`}
                                    onRemove={() => clearFilter("cityIds")}
                                />
                            )}
                        </div>

                        {/* Clear All */}
                        <button
                            type="button"
                            onClick={handleClearAllFilters}
                            className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}
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