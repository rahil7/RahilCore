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

export interface CreateOrderVehicleRequest {
    plateNo: string;
    brandId: number;
    modelId: number;
    variantId: number;
    yearOfManufacture: number;
    exteriorColorId: number;
}