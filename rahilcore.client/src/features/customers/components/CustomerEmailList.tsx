import { Plus, MoreHorizontal, Star, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

import { formatDateTime } from "../../../utils/date-utils";
import type { CustomerEmail } from "../../../types/customer";
import type { SimpleDataTableColumn } from "../../../components/shared/data-table/types";
import { SimpleDataTable } from "../../../components/shared/data-table/SimpleDataTable";

interface CustomerEmailListProps {
    emails: CustomerEmail[];
    onAdd: () => void;
    onSetPrimary: (id: number) => void;
    onDelete: (id: number) => void;
}

export function CustomerEmailList({
    emails,
    onAdd,
    onSetPrimary,
    onDelete,
}: CustomerEmailListProps) {
    const columns: SimpleDataTableColumn<CustomerEmail>[] = [
        {
            id: "email",
            header: "Email",
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{item.email}</span>
                    {item.isPrimary && (
                        <Badge variant="secondary">Primary</Badge>
                    )}
                </div>
            ),
        },
        {
            id: "created",
            header: "Dibuat",
            render: (item) => (
                <div className="space-y-1">
                    <p className="text-xs">{formatDateTime(item.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">
                        {item.createdBy || "-"}
                    </p>
                </div>
            ),
        },
        {
            id: "updated",
            header: "Diperbarui",
            render: (item) => (
                <div className="space-y-1">
                    <p className="text-xs">{formatDateTime(item.updatedAt)}</p>
                    <p className="text-xs text-muted-foreground">
                        {item.updatedBy || "-"}
                    </p>
                </div>
            ),
        },
        {
            id: "actions",
            header: "",
            className: "w-10",
            render: (item) => (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" size="icon" className="h-8 w-8" />
                        }
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {!item.isPrimary && (
                            <DropdownMenuItem onClick={() => onSetPrimary(item.id)}>
                                <Star className="mr-2 h-4 w-4" />
                                Jadikan Primary
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(item.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b px-5 py-4">
                <h3 className="font-semibold">Daftar Email</h3>

                <Button size="sm" onClick={onAdd}>
                    <Plus className="h-4 w-4" />
                    Tambah
                </Button>
            </div>

            <SimpleDataTable
                columns={columns}
                data={emails}
                getRowId={(item) => item.id}
                emptyMessage="Belum ada email."
                maxHeight="200px"
            />
        </div>
    );
}