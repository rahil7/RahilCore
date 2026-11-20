import type { ListQueryParams } from "./pagination";

import type {
    FilterOption,
    QueryFieldOption,
} from "./common";

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


export interface OrderDetailResponse {
    id: number;
    orderNo: string;
    statusId: number;
    status: string;
    paymentStatusId: number;
    paymentStatus: string;
    createdAt: string;
    createdBy: string;
    createdNote: string;
    isAssigned: boolean;
    picName: string | null;
    picPhone: string | null;
    inspectionFormId: number;
    inspectionFormName: string;
    scheduleAt: string;
    note: string;

    customer: OrderCustomer;

    vehicles: {
        vehicleId: number;
        plateNo: string;
        brandId: number;
        brand: string;
        modelId: number;
        model: string;
        variantId: number;
        variant: string;
        yearOfManufacture: number;
        exteriorColorId: number;
        exteriorColor: string;
    }[];

    payment: {
        paymentId: number;
        paymentMethodId: number;
        paymentMethodName: string;
        subtotalAmount: number;
        discountAmount: number;
        totalAmount: number;
        paymentDate: string;
        referenceNo: string | null;
        paymentNote: string | null;
    } | null;

    assignment: {
        inspectorName: string;
        scheduleAt: string;
        assignedAt: string;
        assignedBy: string;
        assignedNote: string | null;
    } | null;

    activities: {
        id: number;
        action: string;
        description: string;
        createdAt: string;
        createdBy: string;
        type: string;
    }[];
}

export interface OrderCustomer {
    customerCode: string;
    customerName: string;
    customerType: string;
    email: string | null;
    phone: string | null;
    address: string | null;
}