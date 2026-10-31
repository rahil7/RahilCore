import { useMemo, useState, useEffect } from "react";
import {
    Search,
    ArrowUp,
    ArrowDown,
    SlidersHorizontal
} from "lucide-react";

import SelectField from "../../components/shared/SelectField";
import FilterDialog from "../../components/shared/FilterDialog";
import CustomerFilterContent, { type CustomerFilters } from "../../features/customers/components/CustomerFilterContent"
import type { CustomerFilterOptions } from "../../types/customer";
import { customerService } from "../../services/customer-service";

export default function CustomerList() {
    console.log("CustomerList render");

    const [searchBy, setSearchBy] = useState("custName");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortBy, setSortBy] = useState("lastActivityAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const searchOptions = useMemo(() => {
        console.log("searchOptions dibuat");
        return [
            { value: "custCode", label: "Customer Code" },
            { value: "custName", label: "Customer Name" },
            { value: "custTypeName", label: "Customer Type" },
            { value: "cityName", label: "City" },
        ];
    }, []);

    const sortOptions = useMemo(() => {
        console.log("sortOptions dibuat");
        return [
            { value: "custCode", label: "Customer Code" },
            { value: "custName", label: "Customer Name" },
            { value: "custTypeName", label: "Customer Type" },
            { value: "cityName", label: "City" },
            { value: "createdAt", label: "Created Date" },
            { value: "lastActivityAt", label: "Last Activity" },
        ];
    }, []);

    const [filterOptions, setFilterOptions] =
        useState<CustomerFilterOptions>({
            customerTypes: [],
            cities: [],
            statuses: [],
            searchFields: [],
            sortFields: []
        });

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await customerService.getFilterOptions();

                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Gagal memuat opsi filter."
                    );
                }

                console.log(response.data);

                setFilterOptions(response.data);
            } catch (error) {
                console.error("Failed to load customer filter options:", error);
            }
        }

        fetchFilterOptions();
    },[]);


    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [draftFilters, setDraftFilters] =
        useState<CustomerFilters>({
            custTypeIds: [],
            cityIds: [],
            status: [],
        });

    const [appliedFilters, setAppliedFilters] =
        useState<CustomerFilters>({
            custTypeIds: [],
            cityIds: [],
            status: [],
        });

    const handleOpenFilter = () => {
        setIsFilterOpen(true);
    };

    const handleApplyFilter = () => {
        setAppliedFilters(draftFilters);
        setIsFilterOpen(false);
    };

    const handleCancelFilter = () => {
        setIsFilterOpen(false);
    };

    const handleResetFilter = () => {
        setDraftFilters({
            custTypeIds: [],
            cityIds: [],
            status: [],
        });
    };

    const hasDraftFilters =
        draftFilters.custTypeIds.length > 0 ||
        draftFilters.cityIds.length > 0 ||
        draftFilters.status.length > 0;

    return (
        <div className="w-full min-w-0 space-y-3">
            <div className="px-1">
                <h1 className="text-xl font-semibold tracking-tight">
                    Customers
                </h1>
                <p className="text-sm text-muted-foreground">
                    Kelola data customer.
                </p>
            </div>

            {/* Toolbar */}
            <div className="@container w-full min-w-0 space-y-2">
                <div className="grid w-full min-w-0 grid-cols-1 gap-3 rounded-lg border bg-card p-3 @md:grid-cols-2 @[64rem]:flex @[64rem]:items-center">
                    {/* Search field */}
                    <SelectField
                        value={searchBy}
                        onChange={setSearchBy}
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
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Cari Customer..."
                            aria-label="Kata kunci pencarian"
                            className="box-border h-10 min-h-10 w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* Sort field */}
                    <div className="relative w-full min-w-0 @md:order-2 @[64rem]:order-none @[64rem]:w-44 @[64rem]:shrink-0">
                        <SelectField
                            value={sortBy}
                            onChange={setSortBy}
                            ariaLabel="Cari berdasarkan"
                            className="w-full min-w-0"
                            options={sortOptions}
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
                                setSortDirection((current) => current === "asc" ? "desc" : "asc");
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
                        </button>

                        <FilterDialog
                            open={isFilterOpen}
                            title="Filter Customers"
                            onClose={handleCancelFilter}
                            onApply={handleApplyFilter}
                            onReset={handleResetFilter}
                            hasDraftFilters={hasDraftFilters}
                        >
                            <CustomerFilterContent
                                options={filterOptions}
                                draftFilters={draftFilters}
                                onChange={setDraftFilters}
                            />
                        </FilterDialog>
                    </div>

                    {/* Active Filters Section */}
                </div>
            </div>
        </div>
    );
}