import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";

import type { SimpleDataTableProps } from "./types";

export function SimpleDataTable<T>({
    columns,
    data,
    getRowId,
    emptyMessage = "Tidak ada data.",
    maxHeight = "320px",
}: SimpleDataTableProps<T>) {
    return (
        <Table
            containerClassName={`max-h-[${maxHeight}] overflow-auto`}
            className="border-separate border-spacing-0"
        >
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead
                            key={column.id}
                            className={`sticky top-0 z-10 bg-muted ${column.className ?? ""}`}
                        >
                            {column.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center text-muted-foreground"
                        >
                            {emptyMessage}
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((item) => (
                        <TableRow key={getRowId(item)}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    className={column.cellClassName}
                                >
                                    {column.render(item)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}