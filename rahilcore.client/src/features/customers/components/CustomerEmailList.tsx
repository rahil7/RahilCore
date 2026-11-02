import { Plus, MoreHorizontal, Star, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";

import { formatDateTime } from "../../../utils/date-utils";
import type { CustomerEmail } from "../../../types/customer";

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
    return (
        <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b px-5 py-4">
                <h3 className="font-semibold">Daftar Email</h3>

                <Button size="sm" onClick={onAdd}>
                    <Plus className="h-4 w-4" />
                    Tambah
                </Button>
            </div>


            <Table containerClassName="max-h-[200px] overflow-y-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky top-0 z-10 bg-muted">
                            Email
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 bg-muted">
                            Dibuat
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 bg-muted">
                            Diperbarui
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 w-10 bg-muted" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {emails.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="h-24 text-center text-muted-foreground"
                            >
                                Belum ada email.
                            </TableCell>
                        </TableRow>
                    ) : (
                        emails.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.email}</span>

                                        {item.isPrimary && (
                                            <Badge variant="secondary">
                                                Primary
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="text-xs">
                                            {formatDateTime(item.createdAt)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.createdBy || "-"}
                                        </p>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="text-xs">
                                            {formatDateTime(item.updatedAt)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.updatedBy || "-"}
                                        </p>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            {!item.isPrimary && (
                                                <DropdownMenuItem
                                                    onClick={() => onSetPrimary(item.id)}
                                                >
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
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

        </div>
    );
}