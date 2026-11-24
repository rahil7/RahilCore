import { useInspectionContext } from "../../contexts/inspections/useInspectionContext";
import { toast } from "sonner"; 
import { getFirstDayOfMonth, getToday } from "../../utils/date-utils";
import { useEffect, useMemo, useState } from "react";
import { inspectionService } from "../../services/inspection-service";
import type { GetInspectionsParams, InspectionFilters, InspectionListItem } from "../../types/inspection";
import { PageHeader } from "../../components/layout/PageHeader";
import InspectionListToolbar from "../../features/inspections/components/InspectionListToolbar";
import InspectionActiveFilters from "../../features/inspections/components/InspectionActiveFilters";
import DataTable from "../../components/shared/data-table/DataTable";
import ListActions from "../../components/shared/ListActions";
import { inspectionColumns } from "../../features/inspections/components/inspectionColumns";
import InspectionMobileCard from "../../features/inspections/components/InspectionMobileCard";


// Initial state
const emptyFilters: InspectionFilters = {
    scheduleFrom: getFirstDayOfMonth(),
    scheduleTo: getToday(),
    custTypeIds: [],
    statusIds: [],
    inspectors: []
};

export default function InspectionList() {
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
        setInspections,
        inspections,
        filterOptions,
        setFilterOptions,
        pagination,
        setPagination,
        appliedFilters,
        setAppliedFilters,
        shouldRefresh,
        setShouldRefresh,
    } = useInspectionContext();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await inspectionService.getFilterOptions();

                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Gagal memuat opsi filter."
                    );
                }

                setFilterOptions(response.data);
            } catch (error) {
                console.error("Failed to load order filter options:", error);
            }
        };

        fetchFilterOptions();
    }, [setFilterOptions]);

    const searchOptions = filterOptions.searchFields;

    const sortOptions = filterOptions.sortFields;

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [draftFilters, setDraftFilters] = useState<InspectionFilters>({ ...emptyFilters });

    const handleOpenFilter = () => {
        setDraftFilters({
            scheduleFrom: appliedFilters.scheduleFrom,
            scheduleTo: appliedFilters.scheduleTo,
            custTypeIds: [...appliedFilters.custTypeIds],
            statusIds: [...appliedFilters.statusIds],
            inspectors: [...appliedFilters.inspectors],
        });

        setIsFilterOpen(true);
    };

    const handleApplyFilter = () => {
        if (!draftFilters.scheduleFrom || !draftFilters.scheduleTo) {
            toast.error("Tanggal inspeksi harus diisi.");
            return;
        }

        if (draftFilters.scheduleFrom > draftFilters.scheduleTo) {
            toast.error("Tanggal mulai tidak boleh melewati tanggal akhir.");
            return;
        }

        setAppliedFilters({ ...draftFilters });

        setIsFilterOpen(false);
    };

    const handleCancelFilter = () => {
        setIsFilterOpen(false);
    };

    const handleResetFilter = () => {
        setDraftFilters({ ...emptyFilters });
    };

    const hasDraftFilters =
        draftFilters.scheduleFrom.length > 0 ||
        draftFilters.scheduleTo.length > 0 ||
        draftFilters.custTypeIds.length > 0 ||
        draftFilters.statusIds.length > 0 ||
        draftFilters.inspectors.length > 0;

    const activeCustomerTypes = useMemo(
        () =>
            (filterOptions.customerTypes ?? [])
                .filter((item) => appliedFilters.custTypeIds.includes(item.id))
                .map((item) => item.name),
        [filterOptions.customerTypes, appliedFilters.custTypeIds]
    );

    const activeStatuses = useMemo(
        () =>
            (filterOptions.inspectionStatus ?? [])
                .filter((item) => appliedFilters.statusIds.includes(item.id))
                .map((item) => item.name),
        [filterOptions.inspectionStatus, appliedFilters.statusIds]
    );

    const activeInspectors = useMemo(
        () =>
            (filterOptions.inspectors ?? [])
                .filter((item) => appliedFilters.inspectors.includes(item.username))
                .map((item) => item.displayName),
        [filterOptions.inspectors, appliedFilters.inspectors]
    );

    const activeFilterCount =
        activeCustomerTypes.length +
        activeStatuses.length +
        activeInspectors.length +
        1; //1 untuk tanggal selalu aktif

    useEffect(() => {
        const params: GetInspectionsParams = {
            page: pagination.page,
            pageSize: pagination.pageSize,
            searchBy: debouncedSearchKeyword.trim() ? searchBy : undefined,
            searchKey: debouncedSearchKeyword.trim(),
            sortBy,
            sortDirection,
            scheduleFrom: appliedFilters.scheduleFrom,
            scheduleTo: appliedFilters.scheduleTo,
            custTypeIds: appliedFilters.custTypeIds,
            statusIds: appliedFilters.statusIds,
            inspectors: appliedFilters.inspectors,
        };

        const queryKey = JSON.stringify(params);

        // Cek apakah GET diperlukan
        if (lastFetchedQueryKey === queryKey && !shouldRefresh) {
            return;
        }

        //console.log(params);

        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 500));

                const response = await inspectionService.getList(params);

                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Gagal memuat data customer."
                    );
                }

                console.log(response);

                setInspections(response.data);

                setPagination(response.pagination);

                setLastFetchedQueryKey(queryKey);
                setShouldRefresh(false);
            } catch (error) {
                console.error("Failed to load customers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [
        searchBy,
        debouncedSearchKeyword,
        sortBy,
        sortDirection,
        appliedFilters,
        pagination.page,
        pagination.pageSize,
        lastFetchedQueryKey,
        shouldRefresh,
        setInspections,
        setLastFetchedQueryKey,
        setPagination,
        setShouldRefresh,
    ]);

    type FilterKey = keyof InspectionFilters;

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
        setAppliedFilters({ ...emptyFilters });
        setDraftFilters({ ...emptyFilters });
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

    useEffect(() => {
        setPagination((current) => ({
            ...current,
            page: 1,
        }));
    }, [
        debouncedSearchKeyword,
        searchBy,
        sortBy,
        sortDirection,
        appliedFilters,
        setPagination,
    ]);

    const handleRefresh = () => {
        setShouldRefresh(true);
    };

    return (
        <div className="w-full min-w-0 space-y-3">
            <PageHeader
                title="Inspection List"
                description="Kelola data dan aktivitas inspeksi."
            />

            {/* Toolbar */}
            <InspectionListToolbar
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
                disabled={isLoading}
            />

            <InspectionActiveFilters
                scheduleFrom={appliedFilters.scheduleFrom}
                scheduleTo={appliedFilters.scheduleTo}
                activeCustomerTypes={activeCustomerTypes}
                activeStatuses={activeStatuses}
                activeInspectors={activeInspectors}
                onRemoveCustomerType={() => clearFilter("custTypeIds")}
                onRemoveStatus={() => clearFilter("statusIds")}
                onRemoveInspector={() => clearFilter("inspectors")}
                onClearAll={handleClearAllFilters}
            />

            <DataTable<InspectionListItem>
                actions={
                    <ListActions
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                    />
                }
                columns={inspectionColumns}
                data={inspections}
                renderMobile={(row) => (
                    <InspectionMobileCard inspection={row} />
                )}
                getRowId={(row) => row.id}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                isLoading={isLoading}
            />
        </div>
    );
}