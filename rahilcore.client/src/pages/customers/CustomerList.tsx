import { useMemo, useState, useEffect } from "react";
import CustomerListToolbar from "../../features/customers/components/CustomerListToolbar";
import type { CustomerFilters } from "../../features/customers/components/CustomerFilterContent"
import type {
    GetCustomersParams,
    CustomerListItem,
} from "../../types/customer";
import { customerService } from "../../services/customer-service";
import CustomerActiveFilters from "../../features/customers/components/CustomerActiveFilters";
import DataTable from "../../components/shared/data-table/DataTable";
import CustomerMobileCard from "../../features/customers/components/CustomerMobileCard";
import { customerColumns } from "../../features/customers/components/customerColumns";
import CustomerListActions from "../../features/customers/components/CustomerListActions";
import { useCustomerContext } from "../../contexts/customers/useCustomerContext";

// Initial state
const emptyFilters: CustomerFilters = {
    custTypeIds: [],
    cityIds: [],
    status: [],
};

export default function CustomerList() {
    console.log("render CustomerList")

    const {
        lastFetchedQueryKey,
        setLastFetchedQueryKey,
        searchBy,
        setSearchBy,
        searchKeyword,
        setSearchKeyword,
        debouncedSearchKeyword,
        setDebouncedSearchKeyword,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        customers,
        setCustomers,
        filterOptions,
        setFilterOptions,
        pagination,
        setPagination,
        appliedFilters,
        setAppliedFilters,
        refreshKey,
        setRefreshKey,
        shouldRefresh,
        setShouldRefresh,
    } = useCustomerContext();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (filterOptions.cities.length > 0) {
            return;
        }

        const fetchFilterOptions = async () => {
            try {
                const response = await customerService.getFilterOptions();

                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Gagal memuat opsi filter."
                    );
                }

                setFilterOptions(response.data);
            } catch (error) {
                console.error("Failed to load customer filter options:", error);
            }
        };

        fetchFilterOptions();
    }, [filterOptions.cities.length, setFilterOptions]);

    const searchOptions = filterOptions.searchFields;

    const sortOptions = filterOptions.sortFields;

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [draftFilters, setDraftFilters] = useState<CustomerFilters>({ ...emptyFilters });

    const handleOpenFilter = () => {
        setDraftFilters({
            custTypeIds: [...appliedFilters.custTypeIds],
            cityIds: [...appliedFilters.cityIds],
            status: [...appliedFilters.status],
        });

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

    const activeCustomerTypes = useMemo(
        () =>
            filterOptions
                .customerTypes
                .filter((item) => appliedFilters.custTypeIds.includes(item.id))
                .map((item) => item.name),
        [filterOptions.customerTypes, appliedFilters.custTypeIds]
    );

    const activeStatuses = useMemo(
        () =>
            filterOptions.statuses
                .filter((item) => appliedFilters.status.includes(item.value))
                .map((item) => item.label),
        [filterOptions.statuses, appliedFilters.status]
    );

    const activeCities = useMemo(
        () =>
            filterOptions.cities.filter((item) =>
                appliedFilters.cityIds.includes(item.id)
            ),
        [filterOptions.cities, appliedFilters.cityIds]
    );

    const visibleCityNames = activeCities
        .slice(0, 2)
        .map((item) => item.name)
        .join(", ");

    const remainingCityCount = Math.max(activeCities.length - 2, 0);

    const cityLabel = remainingCityCount > 0
        ? `${visibleCityNames} +${remainingCityCount}`
        : visibleCityNames;

    const activeFilterCount =
        activeCustomerTypes.length +
        activeStatuses.length +
        activeCities.length;

    const handleRefresh = () => {
        setRefreshKey((current) => current + 1);
    };

    useEffect(() => {
        const params: GetCustomersParams = {
            page: pagination.page,
            pageSize: pagination.pageSize,
            searchBy,
            searchKey: debouncedSearchKeyword,
            sortBy,
            sortDirection,
            status: appliedFilters.status,
            custTypeIds: appliedFilters.custTypeIds,
            cityIds: appliedFilters.cityIds,
        };

        const queryKey = JSON.stringify(params);

        // Cek apakah GET diperlukan
        if (lastFetchedQueryKey === queryKey && !shouldRefresh) {
            return;
        }

        const fetchCustomers = async () => {
            try {
                setIsLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 500));

                const response = await customerService.getList(params);

                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Gagal memuat data customer."
                    );
                }

                setCustomers(response.data);

                setPagination(response.pagination);

                setLastFetchedQueryKey(queryKey);
                setShouldRefresh(false);
            } catch (error) {
                console.error("Failed to load customers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, [
        searchBy,
        debouncedSearchKeyword,
        sortBy,
        sortDirection,
        appliedFilters,
        pagination.page,
        pagination.pageSize,
        refreshKey,
        lastFetchedQueryKey,
        shouldRefresh,
        setCustomers,
        setLastFetchedQueryKey,
        setPagination,
        setShouldRefresh,
    ]);

    type FilterKey = keyof CustomerFilters;

    const clearFilter = (key: FilterKey) => {
        setAppliedFilters((current) => ({
            ...current,
            [key]: [],
        }));

        setDraftFilters((current) => ({
            ...current,
            [key]: [],
        }));
    };

    const handleClearAllFilters = () => {
        setAppliedFilters(emptyFilters);
        setDraftFilters(emptyFilters);
    };

    const handlePageChange = (newPage: number) => {
        setPagination((current) => ({
            ...current,
            page: newPage,
        }));
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination((current) => ({
            ...current,
            page: 1,
            pageSize: newPageSize,
        }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchKeyword(searchKeyword);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchKeyword, setDebouncedSearchKeyword]);

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
            <CustomerListToolbar
                searchBy={searchBy}
                searchKeyword={searchKeyword}
                sortBy={sortBy}
                sortDirection={sortDirection}
                searchOptions={searchOptions}
                sortOptions={sortOptions}
                onSearchByChange={setSearchBy}
                onSearchKeywordChange={setSearchKeyword}
                onSortByChange={setSortBy}
                onSortDirectionChange={() =>
                    setSortDirection((current) =>
                        current === "asc" ? "desc" : "asc"
                    )
                }
                onOpenFilter={handleOpenFilter}
                openFilter={isFilterOpen}
                filterOptions={filterOptions}
                draftFilters={draftFilters}
                hasDraftFilters={hasDraftFilters}
                onApplyFilter={handleApplyFilter}
                onCloseFilter={handleCancelFilter}
                onResetFilter={handleResetFilter}
                onDraftFiltersChange={setDraftFilters}
                activeFilterCount={activeFilterCount}
                disabled={ isLoading }
            />

            <CustomerActiveFilters
                activeCustomerTypes={activeCustomerTypes}
                activeStatuses={activeStatuses}
                cityLabel={cityLabel}
                activeCitiesCount={activeCities.length}
                activeFilterCount={activeFilterCount}
                onRemoveCustomerType={() => clearFilter("custTypeIds")}
                onRemoveStatus={() => clearFilter("status")}
                onRemoveCity={() => clearFilter("cityIds")}
                onClearAll={handleClearAllFilters}
            />

            <DataTable<CustomerListItem>
                actions={
                    <CustomerListActions
                        onRefresh={handleRefresh}
                        onExport={() => console.log("export") }
                        onAdd={() => console.log("Add Customer")}
                        isLoading={isLoading}
                    />
                }
                columns={customerColumns}
                data={customers}
                getRowId={(row) => row.id}
                renderMobile={(row) => (
                    <CustomerMobileCard customer={row} />
                )}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                isLoading = {isLoading}
            />
        </div>
    );
}