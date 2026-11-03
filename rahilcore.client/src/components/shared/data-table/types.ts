
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

export interface SimpleDataTableColumn<T> {
    id: string;
    header: string;
    className?: string;
    cellClassName?: string;
    render: (item: T) => ReactNode;
}

export interface SimpleDataTableProps<T> {
    columns: SimpleDataTableColumn<T>[];
    data: T[];
    getRowId: (item: T) => string | number;
    emptyMessage?: string;
    maxHeight?: string;
}