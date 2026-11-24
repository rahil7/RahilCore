import { useState } from "react";
import { getFirstDayOfMonth, getToday } from "../../utils/date-utils";
import type { InspectionFilterOptions, InspectionFilters, InspectionListItem } from "../../types/inspection";
import type { PaginationMetadata } from "../../types/pagination";
import { InspectionContext } from "./InspectionContext";
import { Outlet } from "react-router-dom";

const emptyFilters: InspectionFilters = {
    scheduleFrom: getFirstDayOfMonth(),
    scheduleTo: getToday(),
    custTypeIds: [],
    statusIds: [],
    inspectors: []
};

export function InspectionProvider() {
    const [lastFetchedQueryKey, setLastFetchedQueryKey] = useState<string | null>(null);

    const [shouldRefresh, setShouldRefresh] = useState(false);

    const [searchBy, setSearchBy] = useState("inspectionNo");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

    const [sortBy, setSortBy] = useState("lastActivityAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const [inspections, setInspections] = useState<InspectionListItem[]>([]);

    const [filterOptions, setFilterOptions] =
        useState<InspectionFilterOptions>({
            customerTypes: [],
            inspectionStatus: [],
            inspectors: [],
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
        useState<InspectionFilters>({ ...emptyFilters });

    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <InspectionContext.Provider
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
                inspections,
                setInspections,
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
        </InspectionContext.Provider>
    );
}