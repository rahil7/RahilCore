import { apiClient, type ApiResponse } from "../lib/api-client";
import type { GetInspectionsParams, InspectionFilterOptions, InspectionListItem } from "../types/inspection";
import type { PagedResponse } from "../types/pagination";

function buildQueryString(params: GetInspectionsParams): string {
    const query = new URLSearchParams();

    if (params.page != null) {
        query.set("page", String(params.page));
    }

    if (params.pageSize != null) {
        query.set("pageSize", String(params.pageSize));
    }

    if (params.searchBy) {
        query.set("searchBy", params.searchBy);
    }

    if (params.searchKey?.trim()) {
        query.set("searchKey", params.searchKey.trim());
    }

    if (params.sortBy) {
        query.set("sortBy", params.sortBy);
    }

    if (params.sortDirection) {
        query.set("sortDirection", params.sortDirection);
    }

    if (params.scheduleFrom) {
        query.set("scheduleFrom", params.scheduleFrom);
    }

    if (params.scheduleTo) {
        query.set("scheduleTo", params.scheduleTo);
    }

    params.custTypeIds?.forEach((id) => {
        query.append("custTypeIds", String(id));
    });

    params.statusIds?.forEach((id) => {
        query.append("statusIds", String(id));
    });

    params.inspectors?.forEach((username) => {
        query.append("inspectors", username);
    });

    return query.toString();
}

export const inspectionService = {
    getFilterOptions() {
        return apiClient.get<ApiResponse<InspectionFilterOptions>>(
            "/api/inspections/filter-options",
        );
    },

    getList(params: GetInspectionsParams = {}) {
        const query = buildQueryString(params);
        const url = query
            ? `/api/inspections?${query}`
            : "/api/inspections";

        return apiClient.get<PagedResponse<InspectionListItem>>(url);
    },
}