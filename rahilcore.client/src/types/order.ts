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

export interface CreateOrderCustomerRequest {
    customerId: number | null;
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

export interface CreateOrderDealerRequest {
    customerId: number;
    totalUnit: number;
    inspectionFormId: number;
    picName: string | null;
    picPhone: string | null;
    note: string;
}