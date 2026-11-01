//component utama yang mengatur keseluruhan tabel.
import { Skeleton } from "../../../components/ui/skeleton";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import type { DataTableProps } from "./types";
import DataTablePagination from "./DataTablePagination";

export default function DataTable<T>({
    columns,
    data,
    getRowId,
    renderMobile,
    pagination,
    onPageChange,
    onPageSizeChange,
    isLoading = false,
}: DataTableProps<T>) {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-lg border bg-card shadow-sm">

            {/* Mobile Layout */}
            {renderMobile && (
                <div className="space-y-3 p-3 md:hidden">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="rounded-lg border p-4 space-y-3">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))
                    ) : data.length > 0 ? (
                        data.map((row) => (
                            <div key={getRowId(row)}>
                                {renderMobile(row)}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            Tidak ada data.
                        </div>
                    )}
                </div>
            )}

            {/* Desktop / Tablet Layout */}
            <div className={renderMobile ? "hidden min-w-0 md:block" : "block min-w-0"}>
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[900px]">
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent">
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.id}
                                        className={`h-11 px-4 font-semibold text-foreground ${column.className ?? ""}`}
                                    >
                                        {column.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableSkeleton columns={columns.length} />
                            ) : data.length > 0 ? (
                                data.map((row) => (
                                    <TableRow
                                        key={getRowId(row)}
                                        className="transition-colors hover:bg-muted/40"
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                className={`px-4 py-3 ${column.className ?? ""}`}
                                            >
                                                {column.cell
                                                    ? column.cell(row)
                                                    : column.accessorKey
                                                        ? String(row[column.accessorKey] ?? "")
                                                        : null}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center text-sm text-muted-foreground"
                                    >
                                        Tidak ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination - Shared Desktop & Mobile */}
            <DataTablePagination
                pagination={pagination}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
        </div>
    );
}
function TableSkeleton({ columns }: { columns: number }) {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                    {Array.from({ length: columns }).map((_, cellIndex) => (
                        <TableCell key={cellIndex} className="px-4 py-3">
                            <Skeleton className="h-4 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}