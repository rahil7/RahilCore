import type { ListQueryParams } from "./pagination";

import type {
    FilterOption,
    StatusFilterOption,
    QueryFieldOption,
} from "./common";
import type { BaseAudit } from "./base";

export interface CustomerListItem {
    id: number;
    custCode: string;
    custName: string;
    custTypeName: string;
    email: string | null;
    phone: string | null;
    cityName: string | null;
    isActive: boolean;
    createdAt: string;
    lastActivityBy: string;
    lastActivityAt: string;
}

export interface CustomerDetail extends BaseAudit {
    custTypeId: number;
    custTypeName: string;
    custCode: string;
    custName: string;
    email: string | null;
    phone: string | null;
    cityId: number | null;
    cityName: string | null;
    address: string | null;
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

export interface CustomerEmail extends BaseAudit {
    email: string;
    isPrimary: boolean;
}

export interface CustomerPhone extends BaseAudit {
    phone: string;
    isPrimary: boolean;
}