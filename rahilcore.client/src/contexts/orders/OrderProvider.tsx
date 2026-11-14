import { Outlet } from "react-router-dom";
import { OrderContext } from "./OrderContext";
import { useState } from "react";
import type { OrderFilterOptions, OrderListItem } from "../../types/order";
import type { PaginationMetadata } from "../../types/pagination";
import type { OrderFilters } from "../../features/orders/components/OrderFilterContent";
import { getFirstDayOfMonth, getToday } from "../../utils/date-utils";

const emptyFilters: OrderFilters = {
    createdFrom: getFirstDayOfMonth(),
    createdTo: getToday(),
    custTypeIds: [],
    statusIds: [],
    paymentStatusIds: []
};

export function OrderProvider() {
    const [lastFetchedQueryKey, setLastFetchedQueryKey] = useState<string | null>(null);

    const [shouldRefresh, setShouldRefresh] = useState(false);

    const [searchBy, setSearchBy] = useState("orderNo");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

    const [sortBy, setSortBy] = useState("lastActivityAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const [orders, setOrders] = useState<OrderListItem[]>([]);

    const [filterOptions, setFilterOptions] =
        useState<OrderFilterOptions>({
            customerTypes: [],
            inspectionStatus: [],
            paymentStatus:[],
            searchFields: [],
            sortFields: [],
        });

    const [pagination, setPagination] = useState<PaginationMetadata>({
        page: 1,
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
    });

    const [appliedFilters, setAppliedFilters] =
        useState<OrderFilters>({ ...emptyFilters });

    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <OrderContext.Provider
            value={{
                lastFetchedQueryKey,
                setLastFetchedQueryKey,
                shouldRefresh,
                setShouldRefresh,
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
                orders,
                setOrders,
                filterOptions,
                setFilterOptions,
                pagination,
                setPagination,
                appliedFilters,
                setAppliedFilters,
                refreshKey,
                setRefreshKey,
            }}
        >
            <Outlet />
        </OrderContext.Provider>
    );
}