import {
    Search,
    ArrowUp,
    ArrowDown,
    SlidersHorizontal
} from "lucide-react";

import SelectField from "../../../components/shared/SelectField";
import FilterDialog from "../../../components/shared/FilterDialog";
import CustomerFilterContent, {
    type CustomerFilters
} from "../../../features/customers/components/CustomerFilterContent";

import type { CustomerFilterOptions } from "../../../types/customer";

interface CustomerListToolbarProps {
    searchBy: string;
    searchKeyword: string;
    sortBy: string;
    sortDirection: "asc" | "desc";

    searchOptions: { value: string; label: string }[];
    sortOptions: { value: string; label: string }[];

    onSearchByChange: (value: string) => void;
    onSearchKeywordChange: (value: string) => void;
    onSortByChange: (value: string) => void;
    onSortDirectionChange: () => void;
    onOpenFilter: () => void;

    openFilter: boolean;
    filterOptions: CustomerFilterOptions;
    draftFilters: CustomerFilters;
    hasDraftFilters: boolean;

    onCloseFilter: () => void;
    onApplyFilter: () => void;
    onResetFilter: () => void;
    onDraftFiltersChange: (filters: CustomerFilters) => void;

    activeFilterCount: number;
    disabled: boolean
}

export default function CustomerListToolbar({
    searchBy,
    searchKeyword,
    sortBy,
    sortDirection,
    searchOptions,
    sortOptions,
    onSearchByChange,
    onSearchKeywordChange,
    onSortByChange,
    onSortDirectionChange,
    onOpenFilter,
    openFilter,
    filterOptions,
    draftFilters,
    hasDraftFilters,
    onCloseFilter,
    onApplyFilter,
    onResetFilter,
    onDraftFiltersChange,
    activeFilterCount,
    disabled
}: CustomerListToolbarProps) {
    return (
        <div className="@container w-full min-w-0 space-y-2">
            <div className="grid w-full min-w-0 grid-cols-1 gap-3 rounded-lg border bg-card p-3 @md:grid-cols-2 @[64rem]:flex @[64rem]:items-center">
                {/* Search field */}
                <SelectField
                    value={searchBy}
                    onChange={onSearchByChange}
                    disabled={disabled}
                    ariaLabel="Cari berdasarkan"
                    className="w-full min-w-0 @md:order-1 @[64rem]:order-none @[64rem]:w-44 @[64rem]:shrink-0"
                    options={searchOptions}
                />

                {/* Search keyword */}
                <div className="flex h-10 w-full min-w-0 items-center gap-2 rounded-md border bg-background px-3 @md:order-3 @md:col-span-2 @[64rem]:order-none @[64rem]:flex-1">
                    <Search
                        size={16}
                        className="shrink-0 text-muted-foreground"
                    />

                    <input
                        type="text"
                        disabled={disabled}
                        value={searchKeyword}
                        onChange={(e) => onSearchKeywordChange(e.target.value)}
                        placeholder="Cari Customer..."
                        aria-label="Kata kunci pencarian"
                        className="box-border h-10 min-h-10 w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:outline-none focus:ring-0"
                    />
                </div>

                {/* Sort field */}
                <div className="relative w-full min-w-0 @md:order-2 @[64rem]:order-none @[64rem]:w-44 @[64rem]:shrink-0">
                    <SelectField
                        value={sortBy}
                        onChange={onSortByChange}
                        disabled={disabled}
                        ariaLabel="Cari berdasarkan"
                        className="w-full min-w-0"
                        options={sortOptions}
                    />
                </div>

                {/* Sort direction & Filter */}
                <div className="flex w-full min-w-0 items-center justify-end gap-2 @md:order-4 @md:col-span-2 @[64rem]:order-none @[64rem]:w-auto @[64rem]:shrink-0">
                    <button
                        type="button"
                        disabled={disabled}
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
                        onClick={onSortDirectionChange}
                        className="inline-flex size-10 w-10 shrink-0 items-center justify-center rounded-md border hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                    >
                        {sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                        ) : (
                            <ArrowDown size={16} />
                        )}
                    </button>

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onOpenFilter}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted md:flex-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        <SlidersHorizontal size={16} />
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <FilterDialog
                        open={openFilter}
                        title="Filter Customers"
                        onClose={onCloseFilter}
                        onApply={onApplyFilter}
                        onReset={onResetFilter}
                        hasDraftFilters={hasDraftFilters}
                    >
                        <CustomerFilterContent
                            options={filterOptions}
                            draftFilters={draftFilters}
                            onChange={onDraftFiltersChange}
                        />
                    </FilterDialog>
                </div>
            </div>
        </div>
    );
}