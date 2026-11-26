import type { ListQueryParams } from "./pagination";
import type {
    FilterOption,
    QueryFieldOption,
} from "./common";
import type { UserLookupDto } from "./user";
import type { Assignment, Customer, Vehicle } from "./base";
import type { Activity } from "./activity";

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

export interface InspectionDetailResponse {
    inspectionid: number;
    inspectionNo: string;
    orderId: number;
    orderNo: string;
    statusId: number;
    statusName: string;
    picName: string | null;
    picPhone: string | null;
    inspectionFormId: number;
    inspectionFormName: string;
    scheduleAt: string;

    createdAt: string;
    createdBy: string;
    createdNote: string;

    lastActivityAt: string;
    LastActivityBy: string;
    lastActivityNote: string;

    customer: Customer;

    vehicles: InspectionVehicle[];

    assignment: Assignment | null;

    activities: Activity[];
}

export interface InspectionVehicle extends Vehicle {
    plateNo: string | null,
    vind: string | null,
    engineNo: string | null,
    taxExpiryDate: string | null,
    odometer: number | null,
    firstOwnership: boolean | null,

    brandId: number | null,
    modelId: number | null,
    variantId: number | null,
    exteriorColorId: number | null,
    bodyTypeId: number | null,
    interiorColorId: number | null,
    fuelTypeId: number | null,
    transmissionId: number | null,
    ownershipTypeId: number | null,
}