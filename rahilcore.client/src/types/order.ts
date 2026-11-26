import type { ListQueryParams } from "./pagination";

import type {
    FilterOption,
    QueryFieldOption,
} from "./common";
import type { UserLookupDto } from "./user";
import type { Activity } from "../types/activity";
import type { Assignment, Customer, Vehicle } from "./base";

export interface OrderFilterOptions {
    customerTypes: FilterOption[];
    inspectionStatus: FilterOption[];
    paymentStatus: FilterOption[];
    searchFields: QueryFieldOption[];
    sortFields: QueryFieldOption[];
}

export interface OrderCreateOptions {
    inspectionForms: FilterOption[];
    cities: FilterOption[];
    exteriorColors: FilterOption[];
    brands: FilterOption[];
}

export interface OrderListItem {
    id: number;
    orderNo: string;
    totalUnit: number;
    statusId: number;
    statusName: string;
    paymentStatusId: number;
    paymentStatusName: string;

    customerCode: string;
    customerName: string;
    customerType: string;

    createdAt: string;
    createdBy: string;
    lastActivityBy: string;
    lastActivityAt: string;
}

export interface GetOrdersParams extends ListQueryParams {
    createdFrom?: string
    createdTo?: string
    custTypeIds?: number[];
    statusIds?: number[];
    paymentStatusIds?: number[];
}

export interface CreateOrderDealerRequest {
    customerId: number;
    scheduleAt: string | null;
    totalUnit: number;
    inspectionFormId: number;
    picName: string | null;
    picPhone: string | null;
    note: string;
}

export interface CreateOrderCustomerRequest {
    customerId: number | null;
    scheduleAt: string | null;
    inspectionFormId: number;
    custName: string | null;
    email: string | null;
    phone: string | null;
    cityId: number | null;
    address: string | null;
    custPresent: boolean;
    picName: string | null;
    picPhone: string | null;
    note: string | null;
    vehicle: CreateOrderVehicleRequest;
}

export interface CreateOrderVehicleRequest {
    plateNo: string;
    brandId: number;
    modelId: number;
    variantId: number;
    yearOfManufacture: number;
    exteriorColorId: number;
}

export interface CreateOrderErrors {
    customerId?: string;
    scheduleAt?: string;
    custName?: string;
    email?: string;
    phone?: string;
    cityId?: string;
    plateNo?: string;
    brandId?: string;
    modelId?: string;
    variantId?: string;
    yearOfManufacture?: string;
    exteriorColorId?: string;
    inspectionFormId?: string;
    totalUnit?: string;
    note?: string;
}

export interface CreatePaymentRequest {
    paymentMethodId: number;
    subtotalAmount: number;
    discountAmount: number | null;
    paymentDate: string;
    referenceNo: string | null;
    note: string;
    paymentProof: File | null;
}

export interface UpdatePaymentRequest {
    paymentMethodId?: number | null;
    subtotalAmount?: number | null;
    discountAmount?: number | null;
    paymentDate?: string | null;
    referenceNo?: string | null;
    note: string;
    paymentProof?: File | null;
}

export interface OrderAssignRequest {
    scheduleAt: string;
    inspectorUsername: string;
    note: string;
}

export interface OrderDetailResponse {
    id: number;
    orderNo: string;
    statusId: number;
    statusName: string;
    paymentStatusId: number;
    paymentStatusName: string;
    createdAt: string;
    createdBy: string;
    createdNote: string;
    canEdit: boolean;
    canEditSchedule: boolean;
    canCancel: boolean;
    canAssign: boolean;
    canReassign: boolean;
    picName: string | null;
    picPhone: string | null;
    inspectionFormId: number;
    inspectionFormName: string;
    scheduleAt: string;
    note: string;

    customer: Customer;

    vehicles: OrderVehicle[];

    payment: OrderPayment | null;

    assignment: Assignment | null;

    activities: Activity[];
}

export interface OrderVehicle extends Vehicle {
    canDelete: boolean
}

export interface OrderPayment {
    paymentId: number;
    paymentMethodId: number;
    paymentMethodName: string;
    subtotalAmount: number;
    discountAmount: number;
    totalAmount: number;
    paymentDate: string;
    referenceNo: string | null;
    hasPaymentProof: boolean;
    lastActivityAt: string;
    lastActivityBy: string;
    lastActivityNote: string;
}

export interface OrderPaymentOptions {
    paymentMethods: FilterOption[];
}

export interface OrderAssignmentOptions {
    inspectors: UserLookupDto[];
}

export interface DeleteOrderItemRequest {
    note: string;
}

export interface UpdateOrderRequest {
    scheduleAt: string | null;
    picName: string;
    picPhone: string;
    note: string;
}

export interface CancelOrderRequest {
    note: string;
}