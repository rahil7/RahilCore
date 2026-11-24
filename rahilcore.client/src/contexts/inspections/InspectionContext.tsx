import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { PaginationMetadata } from "../../types/pagination";
import type { InspectionFilterOptions, InspectionFilters, InspectionListItem } from "../../types/inspection";

export interface InspectionContextValue {
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

    inspections: InspectionListItem[];
    setInspections: Dispatch<SetStateAction<InspectionListItem[]>>;

    filterOptions: InspectionFilterOptions;
    setFilterOptions: Dispatch<SetStateAction<InspectionFilterOptions>>;

    pagination: PaginationMetadata;
    setPagination: Dispatch<SetStateAction<PaginationMetadata>>;

    appliedFilters: InspectionFilters;
    setAppliedFilters: Dispatch<SetStateAction<InspectionFilters>>;

    refreshKey: number;
    setRefreshKey: Dispatch<SetStateAction<number>>;
}

export const InspectionContext = createContext<InspectionContextValue | undefined>(undefined);