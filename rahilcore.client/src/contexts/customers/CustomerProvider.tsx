import { useState } from "react";
import { Outlet } from "react-router-dom";

import { CustomerContext } from "./CustomerContext";

import type {
    CustomerFilterOptions,
    CustomerListItem,
} from "../../types/customer";

import type { PaginationMetadata } from "../../types/pagination";
import type { CustomerFilters } from "../../features/customers/components/CustomerFilterContent";

export function CustomerProvider() {
    const [lastFetchedQueryKey, setLastFetchedQueryKey] =
        useState<string | null>(null);

    const [shouldRefresh, setShouldRefresh] = useState(false);

    const [searchBy, setSearchBy] = useState("custName");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

    const [sortBy, setSortBy] = useState("lastActivityAt");
    const [sortDirection, setSortDirection] =
        useState<"asc" | "desc">("desc");

    const [customers, setCustomers] = useState<CustomerListItem[]>([]);

    const [filterOptions, setFilterOptions] =
        useState<CustomerFilterOptions>({
            customerTypes: [],
            cities: [],
            statuses: [],
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
        useState<CustomerFilters>({
            custTypeIds: [],
            cityIds: [],
            status: [],
        });

    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <CustomerContext.Provider
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
            }}
        >
            <Outlet />
        </CustomerContext.Provider>
    );
}