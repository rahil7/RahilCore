import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

import type {
    CustomerFilterOptions,
    CustomerListItem,
} from "../../types/customer";
import type { PaginationMetadata } from "../../types/pagination";
import type { CustomerFilters } from "../../features/customers/components/CustomerFilterContent";

export interface CustomerContextValue {
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

    customers: CustomerListItem[];
    setCustomers: Dispatch<SetStateAction<CustomerListItem[]>>;

    filterOptions: CustomerFilterOptions;
    setFilterOptions: Dispatch<SetStateAction<CustomerFilterOptions>>;

    pagination: PaginationMetadata;
    setPagination: Dispatch<SetStateAction<PaginationMetadata>>;

    appliedFilters: CustomerFilters;
    setAppliedFilters: Dispatch<SetStateAction<CustomerFilters>>;

    refreshKey: number;
    setRefreshKey: Dispatch<SetStateAction<number>>;
}

export const CustomerContext =
    createContext<CustomerContextValue | undefined>(undefined);