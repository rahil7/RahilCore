
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import SelectField from "../SelectField";
import { Button } from "../../ui/button";

import type { DataTablePaginationProps } from "./types";

export default function DataTablePagination({
    pagination,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps) {
    const { page, pageSize, totalItems, totalPages } = pagination;

    const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

    const endItem = Math.min(page * pageSize, totalItems);

    return (
        <div className="border-t bg-card px-3 py-3 sm:px-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Pagination Information */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <p className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium text-foreground">
                            {startItem}–{endItem}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-foreground">
                            {totalItems}
                        </span>
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            Rows per page
                        </span>

                        <SelectField
                            value={String(pageSize)}
                            onChange={(value) =>
                                onPageSizeChange(Number(value))
                            }
                            ariaLabel="Rows per page"
                            className="w-16 sm:w-20"
                            options={[
                                { value: "5", label: "5" },
                                { value: "10", label: "10" },
                                { value: "20", label: "20" },
                            ]}
                        />
                    </div>
                </div>

                {/* Pagination Navigation */}
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-xs text-muted-foreground sm:hidden">
                        Page {totalPages === 0 ? 0 : page} of {totalPages}
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            disabled={page <= 1 || totalPages === 0}
                            onClick={() => onPageChange(1)}
                            aria-label="First page"
                        >
                            <ChevronsLeft className="size-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            disabled={page <= 1 || totalPages === 0}
                            onClick={() => onPageChange(page - 1)}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        <span className="hidden min-w-16 text-center text-sm sm:block">
                            {totalPages === 0 ? 0 : page} / {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            disabled={page >= totalPages || totalPages === 0}
                            onClick={() => onPageChange(page + 1)}
                            aria-label="Next page"
                        >
                            <ChevronRight className="size-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            disabled={page >= totalPages || totalPages === 0}
                            onClick={() => onPageChange(totalPages)}
                            aria-label="Last page"
                        >
                            <ChevronsRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

}
