
import type { ReactNode } from "react";

export interface DataTableColumn<T> {
    id: string;
    header: string;
    accessorKey?: keyof T;
    cell?: (row: T) => ReactNode;
    className?: string;
}

export interface DataTablePagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface DataTableProps<T> {
    actions?: ReactNode;
    columns: DataTableColumn<T>[];
    data: T[];
    getRowId: (row: T) => string | number;
    renderMobile?: (row: T) => ReactNode;
    pagination: DataTablePagination;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    isLoading?: boolean;
}

export interface DataTablePaginationProps {
    pagination: DataTablePagination;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}
