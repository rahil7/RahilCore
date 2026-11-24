import type { ListQueryParams } from "./pagination";
import type {
    FilterOption,
    QueryFieldOption,
} from "./common";
import type { UserLookupDto } from "./user";

export interface InspectionListItem {
    id: number;
    orderNo: string;
    inspectionNo: string;
    statusId: number;
    statusName: string;
    inspectorUsername: string;
    inspectorName: string;

    customerCode: string;
    customerName: string;
    customerType: string;

    scheduleAt: string;
    plateNo: string;
    brand: string;
    model: string;
    variant: string;

    lastActivityBy: string;
    lastActivityAt: string;
    lastActivityNote: string;
}

export interface InspectionFilterOptions {
    customerTypes: FilterOption[];
    inspectionStatus: FilterOption[];
    inspectors: UserLookupDto[];
    searchFields: QueryFieldOption[];
    sortFields: QueryFieldOption[];
}

export interface InspectionFilters {
    scheduleFrom: string,
    scheduleTo: string,
    custTypeIds: number[];
    statusIds: number[];
    inspectors: string[];
}

export interface GetInspectionsParams extends ListQueryParams {
    scheduleFrom?: string
    scheduleTo?: string
    custTypeIds?: number[];
    statusIds?: number[];
    inspectors?: string[];
}