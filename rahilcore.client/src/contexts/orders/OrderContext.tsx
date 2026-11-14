import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { PaginationMetadata } from "../../types/pagination";
import type { OrderFilterOptions, OrderListItem } from "../../types/order";
import type { OrderFilters } from "../../features/orders/components/OrderFilterContent";

export interface OrderContextValue {
    lastFetchedQueryKey: string | null;
    setLastFetchedQueryKey: Dispatch<SetStateAction<string | null>>;

    shouldRefresh: boolean;
    setShouldRefresh: Dispatch<SetStateAction<boolean>>;

    searchBy: string;
    setSearchBy: Dispatch<SetStateAction<string>>;

    searchKeyword: string;
    setSearchKeyword: Dispatch<SetStateAction<string>>;

    debouncedSearchKeyword: string;
    setDebouncedSearchKeyword: Dispatch<SetStateAction<string>>;

    sortBy: string;
    setSortBy: Dispatch<SetStateAction<string>>;

    sortDirection: "asc" | "desc";
    setSortDirection: Dispatch<SetStateAction<"asc" | "desc">>;

    orders: OrderListItem[];
    setOrders: Dispatch<SetStateAction<OrderListItem[]>>;

    filterOptions: OrderFilterOptions;
    setFilterOptions: Dispatch<SetStateAction<OrderFilterOptions>>;

    pagination: PaginationMetadata;
    setPagination: Dispatch<SetStateAction<PaginationMetadata>>;

    appliedFilters: OrderFilters;
    setAppliedFilters: Dispatch<SetStateAction<OrderFilters>>;

    refreshKey: number;
    setRefreshKey: Dispatch<SetStateAction<number>>;
}

export const OrderContext =
    createContext<OrderContextValue | undefined>(undefined);