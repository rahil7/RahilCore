import { useOrderContext } from "../../contexts/orders/useOrderContext";
import { PageHeader } from "../../components/layout/PageHeader";
import OrderListToolbar from "../../features/orders/components/OrderListToolbar";
import type { OrderFilters } from "../../features/orders/components/OrderFilterContent";
import { useEffect, useMemo, useState } from "react";
import { orderService } from "../../services/order-service";
import type { GetOrdersParams, OrderListItem } from "../../types/order";
import OrderActiveFilters from "../../features/orders/components/OrderActiveFilters";
import { getToday, getFirstDayOfMonth } from "../../utils/date-utils";
import { toast } from "sonner";
import DataTable from "../../components/shared/data-table/DataTable";
import ListActions from "../../components/shared/ListActions";
import { orderColumns } from "../../features/orders/components/orderColumns";
import { useNavigate } from "react-router-dom";
import OrderMobileCard from "../../features/orders/components/OrderMobileCard";

// Initial state
const emptyFilters: OrderFilters = {
    createdFrom: getFirstDayOfMonth(),
    createdTo: getToday(),
    custTypeIds: [],
    statusIds: [],
    paymentStatusIds: []
};

export default function OrderList() {
    const navigate = useNavigate();

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
        setOrders,
        orders,
        filterOptions,
        setFilterOptions,
        pagination,
        setPagination,
        appliedFilters,
        setAppliedFilters,
        shouldRefresh,
        setShouldRefresh,
    } = useOrderContext();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await orderService.getFilterOptions();

                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Gagal memuat opsi filter."
                    );
                }

                //console.log(response.data);

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

    const [draftFilters, setDraftFilters] = useState<OrderFilters>({ ...emptyFilters });

    const handleOpenFilter = () => {
        setDraftFilters({
            createdFrom: appliedFilters.createdFrom,
            createdTo: appliedFilters.createdTo,
            custTypeIds: [...appliedFilters.custTypeIds],
            statusIds: [...appliedFilters.statusIds],
            paymentStatusIds: [...appliedFilters.paymentStatusIds],
        });

        setIsFilterOpen(true);
    };

    const handleApplyFilter = () => {
        if (!draftFilters.createdFrom || !draftFilters.createdTo) {
            toast.error("Created Date range harus diisi.");
            return;
        }

        if (draftFilters.createdFrom > draftFilters.createdTo) {
            toast.error("Created From tidak boleh melewati Created To.");
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
        draftFilters.createdFrom.length > 0 ||
        draftFilters.createdTo.length > 0 ||
        draftFilters.custTypeIds.length > 0 ||
        draftFilters.statusIds.length > 0 ||
        draftFilters.paymentStatusIds.length > 0;

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

    const activePaymentStatuses = useMemo(
        () =>
            (filterOptions.paymentStatus ?? [])
                .filter((item) => appliedFilters.paymentStatusIds.includes(item.id))
                .map((item) => item.name),
        [filterOptions.paymentStatus, appliedFilters.paymentStatusIds]
    );

    const activeFilterCount =
        activeCustomerTypes.length +
        activeStatuses.length +
        activePaymentStatuses.length +
        1 ; //1 untuk tanggal selalu aktif

    useEffect(() => {
        const params: GetOrdersParams = {
            page: pagination.page,
            pageSize: pagination.pageSize,
            searchBy: debouncedSearchKeyword.trim() ? searchBy : undefined,
            searchKey: debouncedSearchKeyword.trim(),
            sortBy,
            sortDirection,
            createdFrom: appliedFilters.createdFrom,
            createdTo: appliedFilters.createdTo,
            custTypeIds: appliedFilters.custTypeIds,
            statusIds: appliedFilters.statusIds,
            paymentStatusIds: appliedFilters.paymentStatusIds,
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

                const response = await orderService.getList(params);

                if (!response.success || !response.data) {
                    throw new Error(
                        response.message || "Gagal memuat data customer."
                    );
                }

                setOrders(response.data);

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
        setOrders,
        setLastFetchedQueryKey,
        setPagination,
        setShouldRefresh,
    ]);

    type FilterKey = keyof OrderFilters;

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

    const handleExport = () => {
        console.log("export");
    };

    const handleAdd = () => {
        navigate("/orders/create");
    };

    return (
        <div className="w-full min-w-0 space-y-3">
            <PageHeader
                title="Order List"
                description="Kelola data dan aktivitas pesanan."
            />

            {/* Toolbar */}
            <OrderListToolbar
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

            <OrderActiveFilters
                createdFrom={appliedFilters.createdFrom}
                createdTo={appliedFilters.createdTo}
                activeCustomerTypes={activeCustomerTypes}
                activeStatuses={activeStatuses}
                activePaymentStatuses={activePaymentStatuses}
                onRemoveCustomerType={() => clearFilter("custTypeIds")}
                onRemoveStatus={() => clearFilter("statusIds")}
                onRemovePaymentStatus={() => clearFilter("paymentStatusIds")}
                onClearAll={handleClearAllFilters}
            />

            <DataTable<OrderListItem>
                actions={
                    <ListActions
                        onRefresh={handleRefresh}
                        onExport={handleExport}
                        onAdd={handleAdd}
                        isLoading={isLoading}
                        addLabel="Create Order"
                    />
                }
                columns={orderColumns}
                data={orders}
                renderMobile={(row) => (
                    <OrderMobileCard order={row} />
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