import type { ListQueryParams } from "./pagination";

import type {
    FilterOption,
    StatusFilterOption,
    QueryFieldOption,
} from "./common";

export interface CustomerListItem {
    id: number;
    custCode: string;
    custName: string;
    custTypeName: string;
    cityName: string | null;
    isActive: boolean;
    createdAt: string;
    lastActivityAt: string | null;
}

export interface CustomerDetail {
    id: number;
    custTypeId: number;
    custTypeName: string;
    custCode: string;
    custName: string;
    email: string | null;
    phone: string | null;
    cityId: number | null;
    cityName: string | null;
    address: string | null;
    isActive: boolean;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
    createdNote: string | null;
    updatedNote: string | null;
}

export interface CustomerFilterOptions {
    cities: FilterOption[];
    customerTypes: FilterOption[];
    statuses: StatusFilterOption[];
    searchFields: QueryFieldOption[];
    sortFields: QueryFieldOption[];
}

export interface GetCustomersParams extends ListQueryParams {
    status?: boolean[];
    custTypeIds?: number[];
    cityIds?: number[];
}

export interface CreateCustomerRequest {
    custTypeId: number;
    custCode: string;
    custName: string;
    email?: string | null;
    phone?: string | null;
    cityId?: number | null;
    address?: string | null;
    note: string;
}

export interface UpdateCustomerRequest {
    custName?: string | null;
    email?: string | null;
    phone?: string | null;
    cityId?: number | null;
    address?: string | null;
    note: string;
}
