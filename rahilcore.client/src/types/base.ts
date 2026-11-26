export interface BaseAudit {
    id: number;
    isActive: boolean;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
    createdNote: string | null;
    updatedNote: string | null;
}

export interface Customer {
    customerCode: string;
    customerName: string;
    customerTypeId: number;
    customerType: string;
    email: string | null;
    phone: string | null;
    address: string | null;
}

export interface Vehicle {
    vehicleId: number;
    plateNo: string | null;
    brand: string | null;
    model: string | null;
    variant: string | null;
    yearOfManufacture: number | null;
    exteriorColor: string | null;
    canDelete: boolean
}

export interface Assignment {
    inspectorUsername: string;
    inspectorName: string;
    scheduleAt: string;
    assignedAt: string;
    assignedBy: string | null;
    assignedNote: string | null;
}