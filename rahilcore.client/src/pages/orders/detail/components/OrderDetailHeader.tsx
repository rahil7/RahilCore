
import { Ellipsis, Pencil, XCircle } from "lucide-react";

import { Badge } from "../../../../components/ui/badge";
import StatusBadge from "../../../../components/shared/StatusBadge";
import { inspectionStatusConfig, paymentStatusConfig } from "../../../../config/status-config";
import { formatDateTime } from "../../../../utils/date-utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";

interface OrderDetailHeaderProps {
    orderNo: string;
    orderType?: string;
    statusId: number;
    statusName: string;
    paymentStatusId: number;
    paymentStatusName: string;
    createdAt: string;
    createdBy: string;
    canEdit: boolean;
    canCancel: boolean;
    onEdit: () => void;
    onCancel: () => void;
}

export default function OrderDetailHeader({
    orderNo,
    orderType,
    statusId,
    statusName,
    paymentStatusId,
    paymentStatusName,
    createdAt,
    createdBy,
    canEdit,
    canCancel,
    onEdit,
    onCancel
}: OrderDetailHeaderProps) {
    const formattedCreatedAt = formatDateTime(createdAt);

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold tracking-tight">
                            {orderNo}
                        </h2>

                        {orderType && (
                            <Badge variant="outline">
                                {orderType}
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Created on {formattedCreatedAt} by {createdBy}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {(canEdit || canCancel) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
                                aria-label="Order actions"
                            >
                                <Ellipsis className="h-4 w-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-36">
                                {canEdit && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            console.log("Edit clicked");
                                            onEdit();
                                        }}
                                        className="cursor-pointer whitespace-nowrap"
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Order
                                    </DropdownMenuItem>
                                )}

                                {canEdit && canCancel && <DropdownMenuSeparator />}

                                {canCancel && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            console.log("Cancel clicked");
                                            onCancel();
                                        }}
                                        className="cursor-pointer whitespace-nowrap text-destructive focus:text-destructive"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancel Order
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                <span className="text-sm text-muted-foreground">
                    Order Status:
                </span>

                <StatusBadge
                    statusId={statusId}
                    label={statusName}
                    config={inspectionStatusConfig}
                />

                <span className="ml-2 text-sm text-muted-foreground">
                    Payment:
                </span>

                <StatusBadge
                    statusId={paymentStatusId}
                    label={paymentStatusName}
                    config={paymentStatusConfig}
                />
            </div>
        </div>
    );
}
