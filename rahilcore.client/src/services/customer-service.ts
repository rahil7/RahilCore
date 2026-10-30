
import { apiClient } from "../lib/api-client";

import type { ApiResponse } from "../types/api";
import type { PagedResponse } from "../types/pagination";

import type {
    CustomerListItem,
    CustomerDetail,
    CustomerFilterOptions,
    GetCustomersParams,
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from "../types/customer";

function buildQueryString(params: GetCustomersParams): string {
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

    params.status?.forEach((value) => {
        query.append("status", String(value));
    });

    params.custTypeIds?.forEach((id) => {
        query.append("custTypeIds", String(id));
    });

    params.cityIds?.forEach((id) => {
        query.append("cityIds", String(id));
    });

    return query.toString();
}

export const customerService = {
    getList(params: GetCustomersParams = {}) {
        const query = buildQueryString(params);
        const url = query
            ? `/api/customers?${query}`
            : "/api/customers";

        return apiClient.get<PagedResponse<CustomerListItem>>(url);
    },

    getById(id: number) {
        return apiClient.get<ApiResponse<CustomerDetail>>(
            `/api/customers/${id}`,
        );
    },

    getFilterOptions() {
        return apiClient.get<ApiResponse<CustomerFilterOptions>>(
            "/api/customers/filter-options",
        );
    },

    create(data: CreateCustomerRequest) {
        return apiClient.post<ApiResponse<unknown>>(
            "/api/customers",
            data,
        );
    },

    update(id: number, data: UpdateCustomerRequest) {
        return apiClient.patch<ApiResponse<unknown>>(
            `/api/customers/${id}`,
            data,
        );
    },
};
