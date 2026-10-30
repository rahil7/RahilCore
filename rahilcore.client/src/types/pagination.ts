export interface PaginationMetadata {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface PagedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: PaginationMetadata;
}

export interface ListQueryParams {
    page?: number;
    pageSize?: number;
    searchBy?: string;
    searchKey?: string;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
}
