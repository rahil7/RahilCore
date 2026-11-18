
import { Pencil } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

interface OrderDetailHeaderProps {
    orderNo: string;
    orderType: "CUSTOMER" | "DEALER";
    status: string;
    paymentStatus: string;
    createdAt: string;
    createdBy: string;
    canEdit: boolean;
    onEdit: () => void;
}

export default function OrderDetailHeader({
    orderNo,
    orderType,
    status,
    paymentStatus,
    createdAt,
    createdBy,
    canEdit,
    onEdit,
}: OrderDetailHeaderProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold tracking-tight">
                            {orderNo}
                        </h2>

                        <Badge variant="outline">
                            {orderType}
                        </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Created on {createdAt} by {createdBy}
                    </p>
                </div>

                {canEdit && (
                    <Button onClick={onEdit} size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Order
                    </Button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                <span className="text-sm text-muted-foreground">
                    Order Status:
                </span>
                <Badge variant="outline">
                    {status}
                </Badge>

                <span className="ml-2 text-sm text-muted-foreground">
                    Payment:
                </span>
                <Badge variant="outline">
                    {paymentStatus}
                </Badge>
            </div>
        </div>
    );
}
