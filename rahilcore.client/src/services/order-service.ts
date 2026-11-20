import { apiClient } from "../lib/api-client";

import type { ApiResponse } from "../types/api";
import type { CreateOrderCustomerRequest, CreateOrderDealerRequest, CreatePaymentRequest, GetOrdersParams, OrderCreateOptions, OrderDetailResponse, OrderFilterOptions, OrderListItem } from "../types/order";
import type { PagedResponse } from "../types/pagination";

function buildQueryString(params: GetOrdersParams): string {
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

    if (params.createdFrom) {
        query.set("createdFrom", params.createdFrom);
    }

    if (params.createdTo) {
        query.set("createdTo", params.createdTo);
    }

    params.custTypeIds?.forEach((id) => {
        query.append("custTypeIds", String(id));
    });

    params.statusIds?.forEach((id) => {
        query.append("statusIds", String(id));
    });

    params.paymentStatusIds?.forEach((id) => {
        query.append("paymentStatusIds", String(id));
    });

    return query.toString();
}

export const orderService = {
    getFilterOptions() {
        return apiClient.get<ApiResponse<OrderFilterOptions>>(
            "/api/orders/filter-options",
        );
    },

    getList(params: GetOrdersParams = {}) {
        const query = buildQueryString(params);
        const url = query
            ? `/api/orders?${query}`
            : "/api/orders";

        return apiClient.get<PagedResponse<OrderListItem>>(url);
    },

    getCreateOptions() {
        return apiClient.get<ApiResponse<OrderCreateOptions>>(
            "/api/orders/create-options",
        );
    },

    createCustomer(data: CreateOrderCustomerRequest) {
        return apiClient.post<ApiResponse<unknown>>(
            "/api/orders/create-customer",
            data,
        );
    },

    createDealer(data: CreateOrderDealerRequest) {
        return apiClient.post<ApiResponse<unknown>>(
            "/api/orders/create-dealer",
            data,
        );
    },

    createPayment(orderId: number, data: CreatePaymentRequest) {
        const formData = new FormData();

        formData.append("paymentMethodId", String(data.paymentMethodId));
        formData.append("subtotalAmount", String(data.subtotalAmount));

        if (data.discountAmount !== null) {
            formData.append("discountAmount", String(data.discountAmount));
        }

        formData.append("paymentDate", data.paymentDate);

        if (data.referenceNo) {
            formData.append("referenceNo", data.referenceNo);
        }

        formData.append("note", data.note);

        if (data.paymentProof) {
            formData.append("paymentProof", data.paymentProof);
        }

        return apiClient.post<ApiResponse<unknown>>(
            `/api/orders/${orderId}/payments`,
            formData,
        );
    },

    getDetail(id: number) {
        return apiClient.get<ApiResponse<OrderDetailResponse>>(
            `/api/orders/${id}`,
        );
    },
}