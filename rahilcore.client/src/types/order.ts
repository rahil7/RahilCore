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
    lastActivityBy: string;
    lastActivityAt: string;
    lastActivityNote: string;
}

export interface GetOrdersParams extends ListQueryParams {
    createdFrom?: string
    createdTo?: string
    custTypeIds?: number[];
    statusIds?: number[];
    paymentStatusIds?: number[];
}