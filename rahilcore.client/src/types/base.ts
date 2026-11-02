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