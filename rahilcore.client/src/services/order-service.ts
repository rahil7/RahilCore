import { apiClient } from "../lib/api-client";

import type { ApiResponse } from "../types/api";
import type { FileAccess } from "../types/file";
import type {
    OrderAssignRequest,
    CreateOrderCustomerRequest,
    CreateOrderDealerRequest,
    CreatePaymentRequest,
    GetOrdersParams,
    OrderAssignmentOptions,
    OrderCreateOptions,
    OrderDetailResponse,
    OrderFilterOptions,
    OrderListItem,
    OrderPaymentOptions,
    UpdatePaymentRequest,
    DeleteOrderItemRequest,
    UpdateOrderRequest,
    CancelOrderRequest
} from "../types/order";
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

    assignment(orderId: number, data: OrderAssignRequest) {
        return apiClient.post<ApiResponse<unknown>>(
            `/api/orders/${orderId}/assign`,
            data,
        );
    },

    getDetail(id: number) {
        return apiClient.get<ApiResponse<OrderDetailResponse>>(
            `/api/orders/${id}`,
        );
    },

    getPaymentProof(paymentId: number) {
        return apiClient.get<FileAccess>(
            `/api/orders/payments/${paymentId}/proof`
        );
    },

    getPaymentOptions() {
        return apiClient.get<ApiResponse<OrderPaymentOptions>>(
            "/api/orders/payment-options"
        );
    },

    getAssignmentOptions() {
        return apiClient.get<ApiResponse<OrderAssignmentOptions>>(
            "/api/orders/assign-options"
        );
    },

    updatePayment(
        orderId: number,
        paymentId: number,
        request: UpdatePaymentRequest
    ) {
        const formData = new FormData();

        if (request.paymentMethodId != null) {
            formData.append("PaymentMethodId", String(request.paymentMethodId));
        }

        if (request.subtotalAmount != null) {
            formData.append("SubtotalAmount", String(request.subtotalAmount));
        }

        if (request.discountAmount != null) {
            formData.append("DiscountAmount", String(request.discountAmount));
        }

        if (request.paymentDate != null) {
            formData.append("PaymentDate", request.paymentDate);
        }

        if (request.referenceNo != null) {
            formData.append("ReferenceNo", request.referenceNo);
        }

        formData.append("Note", request.note);

        if (request.paymentProof) {
            formData.append("PaymentProof", request.paymentProof);
        }

        return apiClient.patch<ApiResponse<unknown>>(
            `/api/orders/${orderId}/payments/${paymentId}`,
            formData
        );
    },

    deleteOrderItem(
        orderId: number,
        itemId: number,
        data: DeleteOrderItemRequest
    ) {
        return apiClient.delete<ApiResponse<unknown>>(
            `/api/orders/${orderId}/items/${itemId}`,
            data
        );
    },

    updateOrder(orderId: number, data: UpdateOrderRequest) {
        return apiClient.put<ApiResponse<unknown>>(
            `/api/orders/${orderId}`,
            data
        );
    },

    cancelOrder(orderId: number, data: CancelOrderRequest) {
        return apiClient.put<ApiResponse<unknown>>(
            `/api/orders/${orderId}/cancel`,
            data
        );
    },
}